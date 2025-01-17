const multer = require("multer");
const fs = require("fs");

const destinationPath = "public/products/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    try {
      fs.mkdirSync(destinationPath, { recursive: true });
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename);
    } catch (error) {
      cb(new Error("Error occurred"));
    }
  },
});

const limits = {
  fileSize: 1024 * 1024,
};

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/png", "image/svg+xml"];

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new multer.MulterError("UNSUPPORTED_FILE_TYPE", "images");
    error.message = "Only jpg, png & svg file types are supported";
    cb(error);
  }
};

const upload = multer({ storage, limits, fileFilter }).array("src");

const uploadProductImages = (req, res, next) => {
  upload(req, res, function (error) {
    if (error) {
      if (error instanceof multer.MulterError) {
        return res.status(400).json({
          status: "FAILED",
          message: "Data Validation Failed",
          errors: { src: "Multer: " + error.message },
        });
      } else {
        return res.status(500).json({
          status: "INTERNAL_SERVER_ERROR",
          message: "SORRY: Something went wrong",
        });
      }
    }
    if (Array.isArray(req.body.images)) {
      // Scenario: Editing product images
      req.body.images = req.body.images.concat(
        req.files.map((file) => file.path)
      );
    } else {
      req.body.images = req.files.map((file) => file.path);
    }

    next();
  });
};

module.exports = uploadProductImages;
