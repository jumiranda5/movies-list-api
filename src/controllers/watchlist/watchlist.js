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

      const movies = watchlistDocument.movies;
      const series = watchlistDocument.series;

      if (movies.length > 0) {
        movies.forEach(movie => {
          movie.isBookmarked = true;
        });
      }

      if (series.length > 0) {
        series.forEach(serie => {
          serie.isBookmarked = true;
        });
      }

      return res.json({
        message: 'Watchlist document found',
        series: series,
        movies: movies
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
