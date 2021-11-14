import mongoose from 'mongoose';
import Media from './media_model';

const Schema = mongoose.Schema;

const WatchlistSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  movies: [Media],
  series: [Media]
});

WatchlistSchema.set('timestamps', true);

const Watchlist = mongoose.model('Watchlist', WatchlistSchema);
export default Watchlist;
