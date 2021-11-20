import { graphDb } from '../../database/graphConfig';
const debug = require('debug')('app:follow-queries');

/* ================================================================================================

                                             FOLLOW

================================================================================================= */

export const createFollow = async (from, to) => {

  await graphDb.query(`
    MATCH (from:User), (to:User)
    WHERE from.userId = '${from}' AND to.userId = '${to}'
    MERGE (from)-[r:FOLLOWS]->(to)
    SET r.createdAt ='${Date.now()}'`
  );

};

export const deleteFollow = async (from, to) => {

  await graphDb.query(`
    MATCH (from:User{userId:'${from}'})-[r:FOLLOWS]->(to:User{userId:'${to}'})
    DELETE r`
  );

};

export const findFollowers = async (userId, page, visitorId) => {

  const nPerPage = 20;
  const nSkip = page > 0 ? ( ( page - 1 ) * nPerPage ) : 0;

  let query;
  if (visitorId === userId) {
    query = `MATCH (from:User)-[f:FOLLOWS]->(u:User{userId:'${userId}'})
      OPTIONAL MATCH (u)-[f2:FOLLOWS]->(from)
      RETURN from, f.createdAt AS createdAt, count(f2) AS isFollowing
      ORDER BY createdAt DESC
      SKIP ${nSkip}
      LIMIT ${nPerPage}`;
  }
  else {
    query = `MATCH (from:User)-[f:FOLLOWS]->(u:User{userId:'${userId}'})
      OPTIONAL MATCH (v:User{userId:'${visitorId}'})-[f2:FOLLOWS]->(from)
      WITH from, f.createdAt AS createdAt, count(f2) AS isFollowing
      ORDER BY isFollowing, createdAt DESC
      RETURN from, createdAt, isFollowing
      SKIP ${nSkip}
      LIMIT ${nPerPage}`;
  }

  const graphRes = await graphDb.query(query);

  const data = graphRes._results;
  const followersList = [];

  for (let i = 0; i < data.length; i++) {
    const user = data[i]._values[0].properties;
    const isFollowingCount = data[i]._values[2];

    debug(`isFollowingCount: ${isFollowingCount}`);

    let isFollowing;
    isFollowingCount > 0 ? isFollowing = true : isFollowing = false;

    const follower = {
      userId: user.userId,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      isFollowing: isFollowing
    };

    //debug(follower);

    followersList.push(follower);
  }

  return followersList;

    /*
  try {

  }
  catch (error) {
   // debug(error);
    throw error;
  }
  */
};

export const findFollowing = async (userId, page, visitorId) => {

  // Todo: review this query...

  const nPerPage = 10;
  const nSkip = page > 0 ? ( ( page - 1 ) * nPerPage ) : 0;

  let query;
  if (visitorId === userId) {
    query = `MATCH (u:User{userId:'${userId}'})-[f:FOLLOWS]->(to:User)
      WITH to, f.createdAt AS createdAt
      RETURN to, createdAt
      ORDER BY createdAt DESC
      SKIP ${nSkip}
      LIMIT ${nPerPage}`;
  }
  else {
    query = `MATCH (u:User{userId:'${userId}'})-[f:FOLLOWS]->(to:User)
      WITH to, f.createdAt AS createdAt
      OPTIONAL MATCH (v:User{userId:'${visitorId}'})-[f2:FOLLOWS]->(to)
      WITH to, createdAt, count(f2) AS isFollowing
      ORDER BY isFollowing DESC
      RETURN to, createdAt, isFollowing
      SKIP ${nSkip}
      LIMIT ${nPerPage}`;
  }

  const graphRes = await graphDb.query(query);

  const data = graphRes._results;
  const followingList = [];

  for (let i = 0; i < data.length; i++) {
    const user = data[i]._values[0].properties;
    const following = {
      userId: user.userId,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      isFollowing: true
    };
    followingList.push(following);
  }

  return followingList;

  /*
  try {

  }
  catch (error) {
    //debug(error);
    throw error;
  }
  */

};
