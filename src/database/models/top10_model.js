import mongoose from 'mongoose';
import Media from './media_model';

const Schema = mongoose.Schema;

const Top10Schema = new Schema({
  _id: {
    type: String, // same as user id
    trim: true
  },
  series: [Media],
  movies: [Media]
});

Top10Schema.set('timestamps', true);

const Top10 = mongoose.model('Top10', Top10Schema);
export default Top10;
