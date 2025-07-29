const { Router } = require("express");
const router = Router();
const { Genre, validateGenre } = require("../Models/Genre");
const auth = require("../Middleware/Auth");
const admin = require("../Middleware/Admin");

router.get("/", (req, res) => {
  Genre.find()
    .then((genres) => {
      if (!genres || genres.length === 0)
        return res.status(404).send("No genres found");
      res.status(200).json(genres);
    })
    .catch((err) => {
      console.error("Error fetching genres:", err);
      res.status(500).send("Internal Server Error");
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const genreById = Genre.findById(id);
  genreById
    .then((genre) => {
      if (!genre) return res.status(404).send("Genre not found");
      res.status(200).json(genre);
    })
    .catch((err) => {
      console.error("Error fetching genre by ID:", err);
      res.status(500).send("Internal Server Error");
    });
});

router.post("/", auth, (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newGenre = new Genre(req.body);
  newGenre
    .save()
    .then((genre) => {
      res.status(201).json(genre);
    })
    .catch((err) => {
      console.error("Error saving genre:", err);
      res.status(500).send("Internal Server Error");
    });
});

router.put("/:id", auth, (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { id } = req.params;
  const updatedGenre = new Genre(req.body);
  updatedGenre._id = id; // Ensure the ID is set for the update

  Genre.findByIdAndUpdate(id, updatedGenre, { new: true })
    .then((genre) => {
      if (!genre) return res.status(404).send("Genre not found");
      res.status(200).json(genre);
    })
    .catch((err) => {
      console.error("Error updating genre:", err);
      res.status(500).send("Internal Server Error");
    });
});

router.delete("/:id", [auth, admin], (req, res) => {
  const { id } = req.params;

  Genre.findByIdAndDelete(id)
    .then((deletedGenre) => {
      if (!deletedGenre) return res.status(404).send("Genre not found");
      res
        .status(200)
        .json({ message: "Genre deleted successfully", genre: deletedGenre });
    })
    .catch((err) => {
      console.error("Error deleting genre:", err);
      res.status(500).send("Internal Server Error");
    });
});

module.exports = router;
