const express = require("express");
const router = express.Router();
const { Rental, validateRental } = require("../Models/Rental");
const { Customer } = require("../Models/Customer");
const { Movie } = require("../Models/Movie");

router.get("/", (req, res) => {
  Rental.find()
    .populate("customer", "name") // Populate customer name
    .populate("movie", "title") // Populate movie titles
    .sort("-dateOut") // Sort by date out, most recent first
    .then((rentals) => {
      if (!rentals || rentals.length === 0)
        return res.status(404).send("No rentals found");
      res.status(200).json(rentals);
    })
    .catch((err) => {
      console.error("Error fetching rentals:", err);
      res.status(500).send("Internal Server Error");
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Rental.findById(id)
    .populate("customer", ["name", "phone"])
    .populate("movie", ["title", "numberInStock", "dailyRentalRate"])
    .then((rental) => {
      if (!rental) return res.status(404).send("Rental not found");
      res.status(200).json(rental);
    })
    .catch((err) => {
      console.error("Error fetching rental by ID:", err);
      res.status(500).send("Internal Server Error");
    });
});

router.post("/", async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { customerId, movieId } = req.body;

  const customer = await Customer.findById(customerId);
  if (!customer) return res.status(400).send("Invalid customer ID");

  const movie = await Movie.findById(movieId);
  if (!movie) return res.status(400).send("Invalid movie ID");
  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock");

  req.body.customer = customer._id;
  req.body.movie = movie._id;
  try {
    const newRental = new Rental(req.body);
    const rental = await newRental.save();

    movie.numberInStock--; // Decrease stock
    await movie.save();

    res.status(201).json(rental);
  } catch (err) {
    console.error("Error saving rental:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
