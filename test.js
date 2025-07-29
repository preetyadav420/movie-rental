console.log("Before");

const timeout = new Promise((resolve) =>
  setTimeout(() => {
    console.log("inside setTimeout");
    resolve("Timeout resolved");
  }, 5000)
);

timeout.then((message) => {
  console.log(message);
  console.log("After");
});

const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/mydatabase")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
