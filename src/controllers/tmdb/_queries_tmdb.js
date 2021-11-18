import Watchlist from '../../database/models/watchlist_model';
const debug = require('debug')('app:tmdb-queries');

/* ================================================================================================

                                         MONGO QUERIES

================================================================================================= */

export const findWatchlist = async (userId, mediaType) => {

  // type: movie || tv

  let watchlist;
  if (mediaType === "movie") watchlist = await Watchlist.findOne({userId: userId}, ['movies']).exec();
  else watchlist = await Watchlist.findOne({userId: userId}, ['series']).exec();

  if (watchlist !== null) {
    debug(`watchlist found: ${watchlist}`);
    return watchlist;
  }
  else {
    debug('Whatchlist document not found');
    return null;
  }

};

