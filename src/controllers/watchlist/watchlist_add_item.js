import { updateWatchlistAddItem } from './_queries_watchlist';
import { verifyAccessToken } from '../../helpers/token_helper';
const debug = require('debug')('app:watchlist');

export const add_watchlist_item = async (req, res, next) => {

  const type = req.body.type;
  const tmdbId = req.body.tmdb_id;
  const title = req.body.title;
  const releaseYear = req.body.release_year;
  const overview = req.body.overview;
  const genre = req.body.genre;
  const posterUrl = req.body.poster;

  const mediaObj = {
    _id: tmdbId,
    type: type,
    title: title,
    release_year: releaseYear,
    overview: overview,
    genre: genre,
    poster: posterUrl
  };

  try {

    debug('Add title to watchlist...');
    const accessToken = req.headers['x-access-token'];
    const dec = await verifyAccessToken(accessToken);

    await updateWatchlistAddItem(dec.userId, type, mediaObj);
    const message = 'Success';
    debug(message);
    return res.json({message: message});

  }
  catch (error) {
    return next(error);
  }

};
