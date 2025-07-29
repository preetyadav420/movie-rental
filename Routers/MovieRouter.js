const { Router } = require("express");
const router = Router();
const { Movie, validateMovie } = require("../Models/Movie");
const { Genre } = require("../Models/Genre");

router.get("/", (req, res) => {
  Movie.find()
    .populate("genre", "name") // Populate genre name
    .then((movies) => {
      if (!movies || movies.length === 0)
        return res.status(404).send("No movies found");
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error("Error fetching movies:", err);
      res.status(500).send("Internal Server Error");
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Movie.findById(id)
    .populate("genre", "name") // Populate genre name
    .then((movie) => {
      if (!movie) return res.status(404).send("Movie not found");
      res.status(200).json(movie);
    })
    .catch((err) => {
      console.error("Error fetching movie by ID:", err);
      res.status(500).send("Internal Server Error");
    });
});

router.post("/", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { genreId } = req.body;
  const genre = await Genre.findById(genreId);
  if (!genre) return res.status(400).send("Invalid genre ID");
  req.body.genre = genre._id;

  const newMovie = new Movie(req.body);
  newMovie
    .save()
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error("Error saving movie:", err);
      res.status(500).send("Internal Server Error");
    });
});

router.put("/:id", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { id } = req.params;
  const movie = await Movie.findById(id);
  if (!movie) return res.status(404).send("Movie not found");

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre ID");
  req.body.genre = genre._id;

  const updatedMovie = new Movie(req.body);
  updatedMovie._id = id;
  updatedMovie.genre = req.body.genreId;

  Movie.findByIdAndUpdate(id, updatedMovie, { new: true })
    .populate("genre", "name")
    .then((movie) => {
      res.status(200).json(movie);
    })
    .catch((err) => {
      console.error("Error updating movie:", err);
      res.status(500).send("Internal Server Error");
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Movie.findByIdAndDelete(id)
    .then((movie) => {
      if (!movie) return res.status(404).send("Movie not found");
      res.status(200).json({ message: "Movie deleted successfully" });
    })
    .catch((err) => {
      console.error("Error deleting movie:", err);
      res.status(500).send("Internal Server Error");
    });
});

module.exports = router;
