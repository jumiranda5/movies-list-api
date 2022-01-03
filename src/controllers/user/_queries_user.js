import { graphDb } from '../../database/graphConfig';
import Post from '../../database/models/post_model';
import User from '../../database/models/user_model';
const debug = require('debug')('app:graph');

/* ================================================================================================

                                        USER - GRAPH

================================================================================================= */

export const searchUser = async (searchQuery, userId, page) => {

  //"CALL db.idx.fulltext.queryNodes('User','ca*') YIELD node AS u RETURN u.name, u.username"
  // use * for fuzzy search

  const nPerPage = 20;
  const nSkip = page > 0 ? ( ( page - 1 ) * nPerPage ) : 0;

  const graphRes = await graphDb.query(`
    CALL db.idx.fulltext.queryNodes('User','${searchQuery}*') YIELD node AS u
    OPTIONAL MATCH (:User{userId:'${userId}'})-[r:FOLLOWS]->(u)
    WITH u, count(r) AS isFollowing
    RETURN u, isFollowing
    ORDER BY isFollowing DESC, u.name
    SKIP ${nSkip}
    LIMIT ${nPerPage}
  `);

  //debug(graphRes._results);

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

  /*
  try {

  }
  catch (error) {
    //debug(error);
    throw error;
  }
  */

};

export const getUserProfile = async (userId, visitorId) => {

  debug(`User id: ${userId}`);
  debug(`Visitor id: ${visitorId}`);

  let query;
  if (userId === visitorId) {

    debug('own profile query...');

    query = `
      MATCH (u:User{userId:'${userId}'})
      OPTIONAL MATCH (:User)-[f1:FOLLOWS]->(u)
      WITH u AS user, count(f1) AS followers
      OPTIONAL MATCH (user)-[f2:FOLLOWS]->(:User)
      OPTIONAL MATCH (user)-[:POSTED]->(p:Post)
      RETURN user, followers, count(DISTINCT f2) AS following, count(DISTINCT p) AS posts
    `;

  }
  else {
    query = `
    MATCH (u:User{userId:'${userId}'})
    OPTIONAL MATCH (:User)-[f1:FOLLOWS]->(u)
    OPTIONAL MATCH (visitor:User{userId: '${visitorId}'})-[isFollowing:FOLLOWS]->(u)
    WITH u AS user, count(f1) AS followers, count(DISTINCT isFollowing) AS isFollowing
    OPTIONAL MATCH (user)-[f2:FOLLOWS]->(:User)
    OPTIONAL MATCH (user)-[:POSTED]->(p:Post)
    RETURN user, followers, count(DISTINCT f2) AS following, count(DISTINCT p) AS posts, isFollowing
  `;

  }

  const graphRes = await graphDb.query(query);
  const results = graphRes._results;

  //debug(graphRes);

  const userRes = results[0]._values[0].properties;
  const followersCount = results[0]._values[1];
  const followingCount = results[0]._values[2];
  const postsCount = results[0]._values[3];

  let isFollowing;
  if (userId !== visitorId) {
    const isFollowingCount = results[0]._values[4];
    if (isFollowingCount > 0) isFollowing = true;
    else isFollowing = false;
  }
  else isFollowing = false;

  debug(`FOLLOWING => ${isFollowing}`);

  const user = {
    userId: userRes.userId,
    username: userRes.username,
    name: userRes.name,
    avatar: userRes.avatar,
  };

  const data = {
    user,
    postsCount,
    followersCount,
    followingCount,
    isFollowing: isFollowing
  };

  return data;

};

export const updateUserNode = async (userData) => {

  const userId = userData._id;
  const name = userData.name;
  const username = userData.username;
  const avatar = userData.avatar;

  try {
    await graphDb.query(`
      MATCH (n:User {userId: '${userId}'})
      SET n += {
        name: '${name}',
        avatar: '${avatar}',
        search: '${username} ${name}'
      }`
    );
    //debug(`User node updated on neo4j`);
  }
  catch (error) {
    debug(error);
    throw error;
  }

};

/* ================================================================================================

                                        USER - MONGO

================================================================================================= */

// Get posts from mongo (post type, media type, title[avatar, id, title], reaction)

export const getUserPosts = async (userId, tab, page) => {

  const nPerPage = 20;
  const nSkip = page > 0 ? ( ( page - 1 ) * nPerPage ) : 0;

  let query;
  if (tab === "multi") query = {userId: userId};
  else if (tab === "tv") query = {"$and": [{userId: userId}, {media_type: 'tv'}]};
  else query = {"$and": [{userId: userId}, {media_type: 'movie'}]};

  const postProperties = ['post_type', 'media_type', 'reaction', 'title', 'createdAt'];

  const posts = await Post.find(query, postProperties)
                          .sort({createdAt: -1})
                          .limit(nPerPage)
                          .skip(nSkip)
                          .exec();

  const postsList = [];

  for (let i = 0; i < posts.length; i++) {
    const post = {
      postId: posts[i]._id,
      postType: posts[i].post_type,
      mediaType: posts[i].media_type,
      reaction: posts[i].reaction || null,
      title: posts[i].title || null
    };
    postsList.push(post);

    //debug(`Media type: ${posts[i].media_type}`)
  }

  return postsList;

};

export const updateUserDocument = async (userData) => {

  const userId = userData._id;
  const name = userData.name;
  const avatar = userData.avatar;

  const query = { _id: userId};
  const options = { new: true };
  let update;

  avatar === "" ?
  update = { $set: { name }} :
  update = { $set: { avatar, name }};

  try {
    //debug(`Updating user...`);
    const user = await User.findOneAndUpdate(query, update, options).exec();

    /*
    debug(`Updated user =>
           username: ${user.username},
           name: ${user.name},
           avatar: ${user.avatar}`);
    */

    return user;
  }
  catch (error) {
    if (error.code === 11000) {
      const err = new Error(`Username must be unique`);
      err.status = 409 ;
      //debug(err.message);
      throw err;
    }
    else throw error;
  }

};
