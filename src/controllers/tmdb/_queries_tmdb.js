import Watchlist from '../../database/models/watchlist_model';
import { graphDb } from '../../database/graphConfig';
import { graphUserObject } from '../../helpers/response_helper';
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
    //debug(`watchlist found: ${watchlist}`);
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

export const getUserReaction = async (tmdb_id, userId) => {

  const query = `
    MATCH (u:User {userId: '${userId}'})-[r:REACTED]->(t:Title { titleId: '${tmdb_id}' })
    RETURN r.reaction AS reaction
  `;

  try {
    const res = await graphDb.query(query);
    const data = res._results;

    if (data.length > 0) {
      const reaction_name = data[0]._values[0];
      return reaction_name;
    }
    else return null;

  }
  catch (error) {
    debug(error);
    throw error;
  }

};

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
    let totalReactions = 0;


    for (let i = 0; i < data.length; i++) {

      const reaction_name = data[i]._values[0];
      const reaction_count = data[i]._values[1];
      totalReactions = totalReactions + reaction_count;

      const reaction = {
        reaction: reaction_name,
        count: reaction_count
      };

      reactions.push(reaction);

    }

    const reactionData = {
      reactions: reactions,
      total: totalReactions
    };

    return reactionData;
  }
  catch (error) {
    debug(error);
    throw error;
  }

};

export const getFollowingReactions = async (tmdb_id, userId) => {

  const query = `
    MATCH (user:User { userId: '${userId}'})-[f:FOLLOWS*0..1]->(u:User)-[r:REACTED]->(t:Title { titleId: '${tmdb_id}'})
    RETURN r.reaction AS type, COUNT(r) AS count
    ORDER BY count DESC
  `;

  try {
    const res = await graphDb.query(query);
    const data = res._results;
    const reactions = [];
    let totalReactions = 0;

    for (let i = 0; i < data.length; i++) {

      const reaction_name = data[i]._values[0];
      const reaction_count = data[i]._values[1];
      totalReactions = totalReactions + reaction_count;

      const reaction = {
        reaction: reaction_name,
        count: reaction_count
      };

      reactions.push(reaction);

    }

    const reactionData = {
      reactions: reactions,
      total: totalReactions
    };

    return reactionData;
  }
  catch (error) {
    debug(error);
    throw error;
  }

};

export const getAllReactionsUsers = async (tmdb_id, page) => {

  const nPerPage = 20;
  const nSkip = page > 0 ? ( ( page - 1 ) * nPerPage ) : 0;

  const query = `
    MATCH (u:User)-[r:REACTED]->(t:Title { titleId: '${tmdb_id}' })
    RETURN u AS user, r.reaction AS reaction
    ORDER BY r.createdAt DESC
    SKIP ${nSkip}
    LIMIT ${nPerPage}
  `;

  try {
    const res = await graphDb.query(query);
    const data = res._results;
    const reactions = [];

    debug(res);

    for (let i = 0; i < data.length; i++) {

      const userGraph = data[i]._values[0].properties;
      const reaction = data[i]._values[1];

      const user = graphUserObject(userGraph);

      const item = {
        reaction,
        user
      };

      debug(reaction);

      reactions.push(item);

    }

    return reactions;
  }
  catch (error) {
    debug(error);
    throw error;
  }
};

export const getFollowingReactionsUsers = async (tmdb_id, user_id, page) => {

  const nPerPage = 20;
  const nSkip = page > 0 ? ( ( page - 1 ) * nPerPage ) : 0;

  const query = `
    MATCH (:User { userId: '${user_id}'})-[f:FOLLOWS*0..1]->(u:User)-[r:REACTED]->(t:Title { titleId: '${tmdb_id}'})
    RETURN u AS user, r.reaction AS reaction
    ORDER BY r.createdAt DESC
    SKIP ${nSkip}
    LIMIT ${nPerPage}
  `;

  try {
    const res = await graphDb.query(query);
    const data = res._results;
    const reactions = [];

    for (let i = 0; i < data.length; i++) {

      const userGraph = data[i]._values[0].properties;
      const reaction = data[i]._values[1];

      const user = graphUserObject(userGraph);

      const item = {
        reaction,
        user
      };

      reactions.push(item);

    }

    return reactions;
  }
  catch (error) {
    debug(error);
    throw error;
  }

};
