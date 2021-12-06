import { getAllReactionsUsers, getFollowingReactionsUsers } from "./_queries_tmdb";
import { verifyAccessToken } from "../../helpers/token_helper";
const debug = require('debug')('app:reactions');

export const reactions_users = async (req, res, next) => {

  const type = req.params.reactionsType; // app || following
  const tmdb_id = req.params.tmdbId;
  const page = req.params.page;

  try {
    const accessToken = req.headers['x-access-token'];
    const dec = await verifyAccessToken(accessToken);
    const userId = dec.userId;

    let reactions;

    debug(type);
    debug(tmdb_id);

    if (type === "app") reactions = await getAllReactionsUsers(tmdb_id, page);
    else reactions = await getFollowingReactionsUsers(tmdb_id, userId, page);

    return res.json({
      reactions
    });

  }
  catch (error) {
    return next(error);
  }

};
