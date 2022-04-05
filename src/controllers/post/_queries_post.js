import Post from '../../database/models/post_model';
import Top10 from '../../database/models/top10_model';
import Notification from '../../database/models/notifications_model';
import User from '../../database/models/user_model';
import { graphDb } from '../../database/graphConfig';
import { graphUserObject } from '../../helpers/response_helper';
const debug = require('debug')('app:post-queries');

/* ================================================================================================

                                          POST - MONGO

================================================================================================= */

export const createPostDocument = async (postData) => {

  //const post = await Post.create(postData);
  //return post;

  debug(postData.title._id);
  const createdAt = Date.now();

  const query = { userId: postData.userId, tmdb_id: postData.title._id };
  const update = { $set: {
    userId: postData.userId,
    post_type: postData.post_type,
    media_type: postData.media_type,
    tmdb_id: postData.title._id,
    title: postData.title,
    reaction: postData.reaction,
    createdAt: createdAt
  }};
  const options = { upsert: true };

  const post = await Post.updateOne(query, update, options).exec();
  debug(post);
  debug(post.upsertedId);
  return post.upsertedId;

};

export const updateTop10 = async (userId, top10, type) => {

  const query = { _id: userId };
  const updateMovies = { $set: { movies: top10 }};
  const updateSeries = { $set: { series: top10 }};
  const options = { upsert: true };

  //debug(`Updating top 10 ${type}`);

  let update;
  if (type === "movie") update = updateMovies;
  else update = updateSeries;

  const updateDoc = await Top10.updateOne(query, update, options).exec();
  const upserted = updateDoc.upsertedCount;
  const modified = updateDoc.modifiedCount;

  if (upserted === 1 || modified === 1) {
    //debug(`Completed insertion.`);
    return true;
  }
  else {
    //debug(`Insertion failed.`);
    const err = new Error(`Server error.`);
    err.status = 500;
    //debug(err.message);
    throw err;
  }

};

export const getPosts = async (postsIds) => {

  const query = {"_id": {$in: postsIds}, "post_type": "reaction"};
  const postObject = [
    '_id',
    'userId',
    'post_type',
    'media_type',
    'title',
    'reaction',
    'createdAt',
    'updatedAt'
  ];

  const posts = await Post.find(query, postObject).sort({createdAt: -1}).exec();

  return posts;

};

export const getPost = async (postId) => {

  const post = await Post.findById(postId).exec();
  return post;

};

export const deletePostDocument = async (postId, userId) => {

  debug('Deleting post document...');
  const del = await Post.deleteOne({_id: postId, userId: userId});
  debug('...done');

  const count = del.deletedCount;

  if (count === 0) {
    const error = new Error(`${postId} not found`);
    error.status = 404;
    throw error;
  }
  else {
    debug('Post deleted on mongo.');
    return count;
  }

};

export const deleteAllPostsDocuments = async (userId) => {

  debug('Deleting user document...');
  const del = await Post.deleteMany({userId: userId});

  const count = del.deletedCount;

  return count;
};

/* ================================================================================================

                                          POST - GRAPH

================================================================================================= */

export const createPostNode = async (postData, postId) => {

  const userId = postData.userId;
  const createdAt = Date.now();

  await graphDb.query(`
    MATCH (from:User {userId: '${userId}'})
    CREATE (post:Post {postId: '${postId}'})
    CREATE (from)-[p:POSTED]->(post)
    SET post.createdAt ='${createdAt}'`
  );

  /*
  try {
    await graphDb.query(`
      MATCH (from:User {userId: '${userId}'})
      CREATE (post:Post {postId: '${postId}'})
      CREATE (from)-[p:POSTED]->(post)
      SET post.createdAt ='${createdAt}'`
    );
    //debug(`res._statistics: ${res._statistics._raw}`);
    return;
  }
  catch (error) {
    //debug(error);
    throw error;
  }
  */

};

export const createPostReaction = async (postData, postId) => {

  debug('should create post reaction with post id');
  debug(postId.toString());
  debug(postId);

  const userId = postData.userId;
  const titleId = postData.title._id;
  const reaction = postData.reaction;
  const createdAt = Date.now();

  await graphDb.query(`
    MATCH (from:User {userId: '${userId}'})
    MERGE (to:Title { titleId: '${titleId}' })
    MERGE (from)-[r:REACTED]->(to)
    SET r.postId = '${postId}'
    SET r.createdAt ='${createdAt}'
    SET r.reaction ='${reaction}'
  `);


};

export const deletePostNode = async (postId) => {

  const query =
   `MATCH (p:Post)
    WHERE p.postId = '${postId}'
    OPTIONAL MATCH (c:Comment)-[:TO]->(p)
    DETACH DELETE c, p`
  ;

  try {
    debug('Deleting post...');
    const post = await graphDb.query(query);
    return post._results;
  }
  catch (error) {
    debug(error);
    throw error;
  }

};

export const getPostGraph = async (postId, userId) => {

  const query = `
    MATCH (user:User)-[:POSTED]->(post:Post{postId: '${postId}'})
    OPTIONAL MATCH (:User)-[l:LIKED]->(post)
    OPTIONAL MATCH (:Comment)-[c:TO]->(post)
    OPTIONAL MATCH (u:User{userId:'${userId}'})-[ul:LIKED]->(post)
    RETURN user, post,
        count(DISTINCT l) AS likeCount,
        count(DISTINCT c) AS commentCount,
        count(DISTINCT ul) AS isLiking
  `;

  try {
    const graphRes = await graphDb.query(query);
    const results = graphRes._results;

    debug(results);

    const user = results[0]._values[0].properties;
    const post = results[0]._values[1].properties.postId;
    const likeCount = results[0]._values[2];
    const commentCount = results[0]._values[3];
    const isLikingInt = results[0]._values[4];

    let isLiking;
    if (isLikingInt > 0) isLiking = true;
    else isLiking = false;

    const userObject = graphUserObject(user);

    const postItem = {
      post,
      user: userObject,
      likeCount,
      commentCount,
      isLiking,
      isOwnPost: false
    };

    return postItem;
  }
  catch (error) {
    debug(error);
    throw error;
  }

};

export const getFeedGraph = async (userId, page) => {

  const nPerPage = 15;
  const nSkip = page > 0 ? ( ( page - 1 ) * nPerPage ) : 0;

  const query = `
    MATCH (n:User{userId:'${userId}'})-[f:FOLLOWS*0..1]->(following:User)-[r:REACTED]->(t:Title)
    RETURN r, t, following
    ORDER BY r.createdAt DESC
    SKIP ${nSkip}
    LIMIT ${nPerPage}
  `;

  try {
    const graphRes = await graphDb.query(query);
    const results = graphRes._results;

    const feed = [];
    const posts = [];

    const feedInfo = {
      posts,
      feed
    };

    for (let i = 0; i < results.length; i++) {

      const postId = results[i]._values[0].properties.postId;
      const user = results[i]._values[2].properties;

      const userObject = graphUserObject(user);
      posts.push(postId);

      const feedItem = {
        user: userObject,
        isOwnPost: false
      };

      feed.push(feedItem);

    }

    //debug(feed);
    debug(feed.length);

    return feedInfo;
  }
  catch (error) {
    debug(error);
    throw error;
  }
};

/* ================================================================================================

                                      NOTIFICATIONS - MONGO

================================================================================================= */

export const createNotification = async (userId, to, type) => {

  // to = user id (follow) || post id (post, comment)
  // type: follow || comment || like

  const notificationObj = {
    type: type,
    from: userId,
    to: to
  };

  try {
    await Notification.create(notificationObj);
    debug(`${type} notification created.`);
  }
  catch (error) {

    debug(`Error code: ${error.code}`);
    debug(`Error message: ${error.message}`);

    throw error;
  }

};

export const findUserFcmToken = async (targetUserId) => {

  try {
    const userObj = ['username', 'fcm_token'];
    debug('Find user sid...');
    const user = await User.findById(targetUserId, userObj).exec();
    debug('... done');

    if (user !== null) {
      debug(user);
      debug(`User fcm token found: ${user.fcm_token}`);
      return user;
    }
    else {
      const err = new Error('Not found.');
      err.status = 404;
      err.message = 'User not found.';
      return null;
    }
  }
  catch(error) {
    debug(error.message);
    throw error;
  }

};
