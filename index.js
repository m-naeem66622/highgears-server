require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectToMongo = require("./config/db");
const {
  notFound,
  errorHandler,
} = require("./api/middlewares/error.middleware");

connectToMongo();

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/public", express.static("public"));

const indexRoutes = require("./api/routes/index.route");
app.use("/api", indexRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
