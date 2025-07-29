const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  res.status(200).send("Welcome to the Home Page!");
});

router.get("/about", (req, res) => {
  res.status(200).send("About Us");
});

module.exports = router;
