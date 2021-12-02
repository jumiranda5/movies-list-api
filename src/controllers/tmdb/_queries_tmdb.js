import Watchlist from '../../database/models/watchlist_model';
import { graphDb } from '../../database/graphConfig';
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

/* ================================================================================================

                                          GRAPH QUERIES

================================================================================================= */

export const getAllReactions = async (tmdb_id) => {

  const query = `
    MATCH (u:User)-[r:REACTED]->(t:Title { titleId: '${tmdb_id}' })
    RETURN r.reaction AS type, COUNT(r) AS count
    ORDER BY count DESC
  `;

  try {
    const res = await graphDb.query(query);
    const data = res._results;
    const reactions = [];

    for (let i = 0; i < data.length; i++) {

      const reaction_name = data[i]._values[0];
      const reaction_count = data[i]._values[1];

      const reaction = {
        reaction: reaction_name,
        count: reaction_count
      };

      reactions.push(reaction);

    }

    return reactions;
  }
  catch (error) {
    debug(error);
    throw error;
  }

};

export const getFollowingReactions = async (tmdb_id, userId) => {

  const query = `
    MATCH (user:User { userId: '${userId}'})-[f:FOLLOWS]->(u:User)-[r:REACTED]->(t:Title { titleId: '${tmdb_id}'})
    RETURN r.reaction AS type, COUNT(r) AS count
    ORDER BY count DESC
  `;

  try {
    const res = await graphDb.query(query);
    const data = res._results;
    const reactions = [];

    for (let i = 0; i < data.length; i++) {

      const reaction_name = data[i]._values[0];
      const reaction_count = data[i]._values[1];

      const reaction = {
        reaction: reaction_name,
        count: reaction_count
      };

      reactions.push(reaction);

    }

    return reactions;
  }
  catch (error) {
    debug(error);
    throw error;
  }

};

