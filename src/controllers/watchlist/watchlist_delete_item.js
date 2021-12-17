import { updateWatchlistDeleteItem } from './_queries_watchlist';
import { verifyAccessToken } from '../../helpers/token_helper';
const debug = require('debug')('app:watchlist');

export const delete_watchlist_item = async (req, res, next) => {

  const type = req.params.type;
  const tmdb_id = req.params.id;

  try {

    debug('Delete title from watchlist...');
    const accessToken = req.headers['x-access-token'];
    const dec = await verifyAccessToken(accessToken);

    await updateWatchlistDeleteItem(dec.userId, type, tmdb_id);
    const message = 'Success!';
    debug(message);
    return res.json({message: message});

  }
  catch (error) {
    debug(error);
    return next(error);
  }

};
