const { Router } = require("express");
const router = Router();
const { User, validateUser } = require("../Models/User");
const _ = require("lodash");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  User.find()
    .then((users) => {
      if (!users || users.length === 0)
        return res.status(404).send("No users found");
      res
        .status(200)
        .json(users.map((user) => _.pick(user, ["_id", "name", "email"])));
    })
    .catch((err) => {
      console.error("Error fetching users:", err);
      res.status(500).send("Internal Server Error");
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) return res.status(404).send("User not found");
      res.status(200).json(_.pick(user, ["_id", "name", "email"]));
    })
    .catch((err) => {
      console.error("Error fetching user by ID:", err);
      res.status(500).send("Internal Server Error");
    });
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already exists");

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  const newUser = new User(req.body);
  await newUser.save();
  const token = newUser.generateAuthToken();
  res
    .header("x-auth-token", token)
    .status(201)
    .json(_.pick(newUser, ["_id", "name", "email"]));
});

router.put("/:id", (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { id } = req.params;
  User.findByIdAndUpdate(id, req.body, { new: true })
    .then((user) => {
      if (!user) return res.status(404).send("User not found");
      res.status(200).json(_.pick(user, ["_id", "name", "email"]));
    })
    .catch((err) => {
      console.error("Error updating user:", err);
      res.status(500).send("Internal Server Error");
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  User.findByIdAndDelete(id)
    .then((user) => {
      if (!user) return res.status(404).send("User not found");
      res.status(200).send("User deleted successfully");
    })
    .catch((err) => {
      console.error("Error deleting user:", err);
      res.status(500).send("Internal Server Error");
    });
});

module.exports = router;
