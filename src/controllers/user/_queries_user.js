import { graphDb } from '../../database/graphConfig';
const debug = require('debug')('app:graph');

/* ================================================================================================

                                               USER

================================================================================================= */


export const searchUser = async (searchQuery, userId, page) => {

  //"CALL db.idx.fulltext.queryNodes('User','ca*') YIELD node AS u RETURN u.name, u.username"
  // use * for fuzzy search

  const nPerPage = 20;
  const nSkip = page > 0 ? ( ( page - 1 ) * nPerPage ) : 0;

  try {
    const graphRes = await graphDb.query(`
      CALL db.idx.fulltext.queryNodes('User','${searchQuery}*') YIELD node AS u
      OPTIONAL MATCH (:User{userId:'${userId}'})-[r:FOLLOWS]->(u)
      WITH u, count(r) AS isFollowing
      RETURN u, isFollowing
      ORDER BY isFollowing DESC, u.name
      SKIP ${nSkip}
      LIMIT ${nPerPage}
    `);
    const graphSearch = graphRes._results;
    debug(graphSearch);

    const results = [];

    for (let i = 0; i < graphRes._results.length; i++) {
      const user = graphRes._results[i]._values[0].properties;
      const follow = graphRes._results[i]._values[1];
      let isFollowing;
      if (follow > 0) isFollowing = true;
      else isFollowing = false;
      const result = {
        userId: user.userId,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        isFollowing: isFollowing
      };
      results.push(result);
    }

    return results;
  }
  catch (error) {
    debug(error);
    throw error;
  }

};
