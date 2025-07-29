const mongoose = require("mongoose");
const Joi = require("joi");

const movieSchema = mongoose.Schema({
  title: { type: String, required: true, minlength: 5, maxlength: 255 },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Genres",
    required: true,
  },
  numberInStock: { type: Number, default: 0, min: 0 },
  dailyRentalRate: { type: Number, default: 0, min: 0 },
});

const Movie = mongoose.model("Movies", movieSchema);

const validateMovie = (movie) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0),
    dailyRentalRate: Joi.number().min(0),
  });
  return schema.validate(movie);
};

exports.Movie = Movie;
exports.validateMovie = validateMovie;
