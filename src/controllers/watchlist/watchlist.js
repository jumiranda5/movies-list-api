import { findWatchlist } from './_queries_watchlist';
import { verifyAccessToken } from '../../helpers/token_helper';
//const debug = require('debug')('app:watchlist');

export const watchlist = async (req, res, next) => {

  try {

    //debug('Get watchlist...');
    const accessToken = req.headers['x-access-token'];
    const dec = await verifyAccessToken(accessToken);

    const watchlistDocument = await findWatchlist(dec.userId);

    if (watchlistDocument) {
      //debug(`Movies: ${watchlistDocument.movies.length}`);
      //debug(`Series: ${watchlistDocument.series.length}`);

      return res.json({
        message: 'Watchlist document found',
        series: watchlistDocument.series,
        movies: watchlistDocument.movies
      });
    }
    else {
      return res.json({ message: 'Watchlist document not found' });
    }

  }
  catch (error) {
    return next(error);
  }

};
