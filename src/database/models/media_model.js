import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MediaSchema = new Schema({
  _id: {
    type: String, // TMDB id
    trim: true
  },
  type: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  release_year: {
    type: String,
    trim: true
  },
  overview: { type: String },
  genre: {
    type: String,
    trim: true
  },
  poster: {
    type: String,
    trim: true
  }
});

export default MediaSchema;
