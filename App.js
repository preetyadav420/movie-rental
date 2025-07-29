const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// Import routers
const genresRouter = require("./Routers/GenresRouter");
const homeRouter = require("./Routers/HomeRouter");
const customersRouter = require("./Routers/CustomerRouter");
const moviesRouter = require("./Routers/MovieRouter");
const rentalsRouter = require("./Routers/RentalRouter");
const usersRouter = require("./Routers/UserRouter");
const authRouter = require("./Routers/AuthRouter");

const app = express();

const connection = mongoose
  .connect("mongodb://localhost:27017/MyNodeApp")
  .then(() => {
    console.log("Connected to Databse");
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Middleware setup
app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));

app.use("/", homeRouter);
app.use("/api/genres", genresRouter);
app.use("/api/customers", customersRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/rentals", rentalsRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

module.exports = connection;
