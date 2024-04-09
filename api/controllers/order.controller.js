const axios = require("axios");
const { PROJECTION } = require("../../config/config");
const Order = require("../services/order.service");
const Product = require("../services/product.service");
const { throwError } = require("../utils/error.util");
const generateMongoId = require("../utils/generateMongoId");

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private/User
 */
const createOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;

    req.body.user = userId;
    const order = await Order.create(req.body);

    if (order.status === "FAILED") {
      throwError(
        order.status,
        order.error.statusCode,
        order.error.message,
        order.error.identifier
      );
    }

    // order.data.user = undefined;

    res.status(201).json({
      status: "SUCCESS",
      message: "Order created successfully",
      data: order.data,
    });
  } catch (error) {
    next(error);
  }
};

const checkout = async (req, res, next) => {
  try {
    const productIds = req.body.products.map((product) => product.product);

    const fetchedProducts = await Product.get(
      { _id: { $in: productIds } },
      PROJECTION.product.order,
      1,
      productIds.length
    );

    if (fetchedProducts.status === "FAILED") {
      throwError(
        fetchedProducts.status,
        fetchedProducts.error.statusCode,
        fetchedProducts.error.message,
        fetchedProducts.error.identifier
      );
    }

    let itemsPrice = 0;
    let discountedPrice = 0;
    let shippingPrice = 0;
    let itemsCountWithShipping = 0; // To avoid division of product with free shipping
    let products = [];

    for (let i = 0; i < fetchedProducts.data.length; i++) {
      const product = fetchedProducts.data[i];
      const item = req.body.products.find(
        (item) => item.product.toString() === product._id.toString()
      );

      if (item) {
        // Product Calculation And Validation
        itemsPrice += product.original_price * item.quantity;
        discountedPrice +=
          (product.original_price - product.selling_price) * item.quantity;
        shippingPrice += product.shipping_price;

        if (product.shipping_price !== 0) ++itemsCountWithShipping;

        if (!product.available_sizes.includes(item.size)) {
          throwError(
            "FAILED",
            422,
            `Size ${item.size} is not available for product ${product.name}`,
            "0x000B03"
          );
        }
        if (!product.available_colors.includes(item.color)) {
          throwError(
            "FAILED",
            422,
            `Color ${item.color} is not available for product ${product.name}`,
            "0x000B04"
          );
        }
        if (!product.in_stock) {
          throwError(
            "FAILED",
            422,
            `Product ${product.name} is out of stock`,
            "0x000B05"
          );
        }

        // Getting the response ready
        const { available_colors, available_sizes, ...rest } = product._doc;
        products.push({
          ...rest,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        });
      }
    }

    if (itemsCountWithShipping)
      discountedPrice = (discountedPrice / itemsCountWithShipping).toFixed(2);

    const totalPrice = 1;
    const orderId = generateMongoId();
    let payfastAcessToken = null;
    try {
      const response = await axios.post(
        `https://ipguat.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken?MERCHANT_ID=${process.env.PAYFAST_MERCHANT_ID}&SECURED_KEY=${process.env.PAYFAST_SECURED_KEY}&BASKET_ID=${orderId}&TXNAMT=${totalPrice}`
      );

      if (response.data.ACCESS_TOKEN) {
        payfastAcessToken = response.data.ACCESS_TOKEN;
      }
    } catch (error) {
      console.log("PayFast Token Error: ", error);
      return res.status(422).json({ status: "FAILED", error: error.message });
    }

    res.json({
      status: "SUCCESS",
      data: {
        formParameters: {
          MERCHANT_ID: process.env.PAYFAST_MERCHANT_ID,
          MERCHANT_NAME: process.env.PAYFAST_MERCHANT_NAME,
          TOKEN: payfastAcessToken,
          PROCCODE: "00",
          TXNAMT: totalPrice,
          CURRENCY_CODE: "USD",
          BASKET_ID: orderId,
        },
        _id: orderId,
        cartItems: products,
        itemsPrice,
        shippingPrice,
        discountedPrice,
        totalPrice,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const queryType = req.query.queryType || "default";

    const filter = {};
    if (req.user.role === "USER") filter.user = req.user._id;
    if (req.query.orderStatus) filter.orderStatus = req.query.orderStatus;

    let projection =
      queryType === "table"
        ? {
            root: req.query.include?.root?.reduce((acc, field) => {
              acc[field] = 1;
              return acc;
            }, {}),
            user:
              req.query.include?.user?.join(" ") || PROJECTION.order.nestedUser,
          }
        : {
            root: {},
            user: PROJECTION.order.nestedUser,
            // products: PROJECTION.order.nestedProduct,
          };

    const totalOrders = await Order.count(filter);
    const orders = await Order.get(filter, projection, page, limit);

    if (orders.status === "FAILED") {
      throwError(
        orders.status,
        orders.error.statusCode,
        orders.error.message,
        orders.error.identifier
      );
    }

    const pagination = {
      totalPages: Math.ceil(totalOrders.data / limit),
      currentPage: page,
      totalOrders: totalOrders.data,
      currentOrders: orders.data.length,
      limit,
    };

    res.json({
      status: "SUCCESS",
      pagination,
      data: orders.data,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const filter = { _id: orderId, user: req.user._id };

    let projection = {
      root: {},
      user: PROJECTION.order.nestedUser,
    };

    const order = await Order.getSingle(filter, projection);

    if (order.status === "FAILED") {
      throwError(
        order.status,
        order.error.statusCode,
        order.error.message,
        order.error.identifier
      );
    }

    res.json({
      status: "SUCCESS",
      data: order.data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, checkout, getOrders, getSingleOrder };
