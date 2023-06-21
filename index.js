// require movie model
const Movie = require("./models/movie");
require("dotenv").config();
// express
const express = require("express");
const app = express();
const cors = require("cors");
// Enable CORS
app.use(cors());
app.use(express.json());
app.use(express.static("build"));
// Custom Middleware
const requestLogger = (req, res, next) => {
  console.log(`Request Method: ${req.method}`);
  console.log(`Request Path: ${req.path}`);
  Object.keys(req.body).length !== 0 && console.log(`Request Body:`, req.body);
  console.log("--------------------------------");
  next();
};
// Implementing the Middleware
app.use(requestLogger);
// error handler middleware
const errorHandler = (error, request, response, next) => {
  console.error("error message:", error.message);
  if (error.name === "CastError") {
    return response.status(400).json({ error: "invalid id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.get("/api/movies", async (req, res) => {
  const movies = await Movie.find({});
  res.json(movies);
});

app.get("/api/movies/:id", async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
    } else {
      res.json(movie);
    }
  } catch (error) {
    next(error);
  }
});

app.delete("/api/movies/:id", async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (movie) {
      res
        .status(200)
        .json({ message: `The movie [${movie.title}] removed successfully` });
    } else {
      res.status(404).json({ error: "The movie not found." });
    }
  } catch (error) {
    next(error);
  }
});

app.post("/api/movies", async (req, res, next) => {
  const { title, watchList } = req.body;
  try {
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const movie = new Movie({ title: title, watchList: watchList || false });
    const savedMovie = await movie.save();
    res.json(savedMovie);
  } catch (error) {
    next(error);
  }
});

app.put("/api/movies/:id", async (req, res, next) => {
  const { title, watchList } = req.body;
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      { title, watchList },
      { new: true, runValidators: true }
    );
    res.json(updatedMovie);
  } catch (error) {
    next(error);
  }
});

// implement error handler middleware
app.use(errorHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
