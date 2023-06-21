// mongoose and dotenv
const mongoose = require("mongoose");
require("dotenv").config();
const DB_URI = process.env.MONGODB_URI;

// mongoose config and connection
mongoose.set("strictQuery", false);
mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Connection established");
  })
  .catch((err) =>
    console.log("Error connecting to Mongoose server: ", err.message)
  );

// create mongoose schema for movies
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, minLength: 2 },
  watchList: Boolean,
});

movieSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});
// create mongoose Movie Model
module.exports = mongoose.model("Movie", movieSchema);
