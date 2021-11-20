import { graphDb } from '../../database/graphConfig';
import Post from '../../database/models/post_model';
//const debug = require('debug')('app:graph');

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

  let query;
  if (userId === visitorId) {

    //debug('own profile query...');

    query = `
      MATCH (u:User{userId:'${userId}'})
      MATCH (:User)-[f1:FOLLOWS]->(u)
      WITH u AS user, count(f1) AS followers
      MATCH (user)-[f2:FOLLOWS]->(:User)
      MATCH (user)-[:POSTED]->(p:Post)
      RETURN user, followers, count(DISTINCT f2) AS following, count(DISTINCT p) AS posts
    `;

  }
  else {

    //debug('other profile query...');

    query = ``;

  }

  const graphRes = await graphDb.query(query);
  const results = graphRes._results;

  //debug(results);

  const userRes = results[0]._values[0].properties;
  const followersCount = results[0]._values[1];
  const followingCount = results[0]._values[2];
  const postsCount = results[0]._values[3];

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
    isFollowing: false
  };

  return data;

};


/* ================================================================================================

                                        USER - MONGO

================================================================================================= */

// Get posts from mongo (post type, media type, title[avatar, id, title], reaction)

export const getUserPosts = async (userId) => {

  const postProperties = ['post_type', 'media_type', 'reaction', 'title'];

  const posts = await Post.find({userId: userId}, postProperties).exec();

  const postsList = [];

  for (let i = 0; i < posts.length; i++) {
    const post = {
      postType: posts[i].post_type,
      mediaType: posts[i].media_type,
      reaction: posts[i].reaction || null,
      title: posts[i].title || null
    };
    postsList.push(post);
  }

  return postsList;

};
