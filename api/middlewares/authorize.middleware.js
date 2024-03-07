// Middleware for authorizing user roles (Admin, Doctor, Patient)
const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      status: "FAILED",
      error: {
        statusCode: 403,
        message: "Forbidden",
        identifier: "0x001300",
      },
    });
  }
  next();
};

const isUser = (req, res, next) => {
  if (req.user.role !== "USER") {
    return res.status(403).json({
      status: "FAILED",
      error: {
        statusCode: 403,
        message: "Forbidden",
        identifier: "0x001301",
      },
    });
  }
  next();
};

module.exports = { isAdmin, isUser };
