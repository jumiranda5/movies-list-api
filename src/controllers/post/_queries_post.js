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

  const post = await Post.create(postData);
  return post;

  /*
  try {
    const post = await Post.create(postData);
    debug('Post document created on mongodb.');
    return post;
  }
  catch (error) {
    debug(`Error code: ${error.code}`);
    debug(`Error message: ${error.message}`);

    throw error;
  }
  */

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

export const getPosts = async (ids) => {

  const query = {"_id": {$in: ids}};
  const postObject = [
    '_id',
    'userId',
    'post_type',
    'media_type',
    'title',
    'top_10',
    'reaction',
    'comment'
  ];

  const posts = await Post.find(query, postObject).exec();
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

  const userId = postData.userId;
  const titleId = postData.title._id;
  const reaction = postData.reaction;
  const createdAt = Date.now();

  await graphDb.query(`
    MATCH (from:User {userId: '${userId}'})
    MERGE (to:Title { titleId: '${titleId}' })
    MERGE (from)-[r:REACTED {reaction: '${reaction}'}]->(to)
    CREATE (post:Post {postId: '${postId}'})
    CREATE (from)-[p:POSTED]->(post)
    SET post.createdAt ='${createdAt}'
  `);

  /*
  try {
    await graphDb.query(`
      MATCH (from:User {userId: '${userId}'})
      MERGE (to:Title { titleId: '${titleId}' })
      MERGE (from)-[r:REACTED {reaction: '${reaction}'}]->(to)
      CREATE (post:Post {postId: '${postId}'})
      CREATE (from)-[p:POSTED]->(post)
      SET post.createdAt ='${createdAt}'
    `);
    //debug(`res._statistics: ${res._statistics._raw}`);
    return;
  }
  catch (error) {
    //debug(error);
    throw error;
  }
  */

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
    MATCH (n:User{userId:'${userId}'})-[f:FOLLOWS*0..1]->(following:User)-[:POSTED]->(post)
    OPTIONAL MATCH (:User)-[l:LIKED]->(post)
    OPTIONAL MATCH (:Comment)-[c:TO]->(post)
    OPTIONAL MATCH (n)-[nl:LIKED]->(post)
    RETURN post, following,
        count(DISTINCT l) AS likeCount,
        count(DISTINCT c) AS commentCount,
        count(DISTINCT nl) AS isLiking
    ORDER BY post.createdAt DESC
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

    //debug(results);

    for (let i = 0; i < results.length; i++) {

      const post = results[i]._values[0].properties.postId;
      const createdAt = results[i]._values[0].properties.createdAt;
      const user = results[i]._values[1].properties;
      const likeCount = results[i]._values[2];
      const commentCount = results[i]._values[3];
      const isLikingInt = results[i]._values[4];

      let isLiking;
      if (isLikingInt > 0) isLiking = true;
      else isLiking = false;

      posts.push(post);

      const userObject = graphUserObject(user);

      const feedItem = {
        post,
        createdAt,
        user: userObject,
        likeCount,
        commentCount,
        isLiking,
        isOwnPost: false
      };

      feed.push(feedItem);

    }

    return feedInfo;
  }
  catch (error) {
    debug(error);
    throw error;
  }
};

/*

  FEED WITH RECOMMENDATIONS (FOR FUTURE IMPLEMENTATION - REMOVED IT FOR NOW);

  const query = `
  MATCH (n:User{userId:'${userId}'})-[f:FOLLOWS*0..1]->(following:User)-[:POSTED]->(post)
  OPTIONAL MATCH (u:User)-[r:RECOMMENDED]->(post)
  OPTIONAL MATCH (:User)-[l:LIKED]->(post)
  OPTIONAL MATCH (:Comment)-[c:TO]->(post)
  OPTIONAL MATCH (n)-[nl:LIKED]->(post)
  WITH post, following,
        r.titleId AS titleId,
        r.title AS title,
        r.poster AS poster,
        count(DISTINCT r) as recCount,
        collect(DISTINCT [u.userId, u.avatar])[0..3] as users,
        count(DISTINCT l) AS likeCount,
        count(DISTINCT c) AS commentCount,
        count(DISTINCT nl) AS isLiking
  ORDER BY recCount DESC
  RETURN post,
          following,
          collect([titleId, title, recCount, users, poster])[0..3] as recs,
          likeCount,
          commentCount,
          isLiking
  ORDER BY post.createdAt DESC
  SKIP ${nSkip}
  LIMIT ${nPerPage}
  `;

*/

/* ================================================================================================

                                          LIKE - GRAPH

================================================================================================= */

// Likes

export const findLikes = async (id, userId, page, type) => {

  const nPerPage = 20;
  const nSkip = page > 0 ? ( ( page - 1 ) * nPerPage ) : 0;

  let query;

  const queryComment = `
    MATCH (u:User)-[l:LIKED]->(c:Comment{commentId:'${id}'})
    OPTIONAL MATCH (me:User{userId: '${userId}'})-[f:FOLLOWS]->(u)
    RETURN u AS user, count(DISTINCT f) as isFollowing, l.createdAt AS createdAt
    ORDER BY isFollowing DESC, createdAt DESC
    SKIP ${nSkip}
    LIMIT ${nPerPage}
  `;

  const queryPost = `
    MATCH (u:User)-[l:LIKED]->(p:Post{postId:'${id}'})
    OPTIONAL MATCH (me:User{userId: '${userId}'})-[f:FOLLOWS]->(u)
    RETURN u AS user, count(DISTINCT f) as isFollowing, l.createdAt AS createdAt
    ORDER BY isFollowing DESC, createdAt DESC
    SKIP ${nSkip}
    LIMIT ${nPerPage}
  `;

  if (type === "post") query = queryPost;
  else query = queryComment;

  const graphRes = await graphDb.query(query);

  const data = graphRes._results;
  const likesList = [];

  debug(data);

  for (let i = 0; i < data.length; i++) {
    const user = data[i]._values[0].properties;
    const isFollowingCount = data[i]._values[1];

    let isFollowing;
    isFollowingCount > 0 ? isFollowing = true : isFollowing = false;

    debug(`Liked: ${user.username} / isFollowingCount: ${isFollowingCount}`);

    const follower = {
      userId: user.userId,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      isFollowing: isFollowing
    };

    likesList.push(follower);
  }

  return likesList;

};

export const createLike = async (from, to, type) => {

  const createdAt = Date.now();

  let query;

  if (type === 'post') {
    query = `MATCH (from:User), (to:Post)
    WHERE from.userId = '${from}' AND to.postId = '${to}'
    CREATE (from)-[r:LIKED]->(to)
    SET r.createdAt ='${createdAt}'`;
  }
  else if (type === 'comment') {
    query = `MATCH (from:User), (to:Comment)
    WHERE from.userId = '${from}' AND to.commentId = '${to}'
    CREATE (from)-[r:LIKED]->(to)
    SET r.createdAt ='${createdAt}'`;
  }

  try {
    debug('Creating like edge...');
    await graphDb.query(query);
    debug('...done');
  }
  catch (error) {
    debug(error);
    throw error;
  }

};

export const deleteLike = async (from, to, type) => {

  let query;

  if (type === 'post') {
    query = `MATCH (from:User {userId: '${from}'})-[r:LIKED]->(to:Post {postId: '${to}'})
    DELETE r`;
  }
  else if (type === 'comment') {
    query = `MATCH (from:User {userId: '${from}'})-[r:LIKED]->(to:Comment {commentId: '${to}'})
    DELETE r`;
  }

  try {
    debug('Deleting like edge...');
    await graphDb.query(query);
    debug('...done');
  }
  catch (error) {
    debug(error);
    throw error;
  }

};

/* ================================================================================================

                                        COMMENT - GRAPH

================================================================================================= */

export const createComment = async (userId, postId, comment, commentId, responseTo) => {

  // responseTo: post || username

  const createdAt = Date.now();

  const query =
   `MATCH (u:User), (p:Post)
    WHERE u.userId = '${userId}' AND p.postId = '${postId}'
    CREATE (c:Comment {
      commentId: '${commentId}',
      responseTo: '${responseTo}',
      comment: '${comment}',
      createdAt:'${createdAt}'
    })
    CREATE (u)-[:COMMENTED]->(c)-[:TO]->(p)
    RETURN c`
  ;

  try {
    debug('Creating comment on graph...');
    const comment = await graphDb.query(query);
    debug(comment._results[0]._values[0].properties);
    return comment._results[0]._values[0].properties;
  }
  catch (error) {
    debug(error);
    throw error;
  }

};

export const deleteComment = async (commentId) => {

  const query =
   `MATCH (c:Comment)
    WHERE c.commentId = '${commentId}'
    DETACH DELETE c`
  ;

  try {
    debug('Deleting comment...');
    await graphDb.query(query);
    return;
  }
  catch (error) {
    debug(error);
    throw error;
  }

};

export const getComments = async (postId, userId, page) => {

  const nPerPage = 15;
  const nSkip = page > 0 ? ( ( page - 1 ) * nPerPage ) : 0;

  const query =
    `MATCH (u:User)-[:COMMENTED]->(c:Comment)-[:TO]->(p:Post {postId: '${postId}'})
    OPTIONAL MATCH (:User)-[l:LIKED]->(c)
    OPTIONAL MATCH (:User {userId: '${userId}'})-[l2:LIKED]->(c)
    WITH u, c, p, count(l) AS likes, count(l2) AS isLiking
    RETURN collect([u, c, likes, isLiking]) AS comment
    ORDER BY c.createdAt ASC
    SKIP ${nSkip}
    LIMIT ${nPerPage}`
  ;

  debug('Getting comments...');
  const graphRes = await graphDb.query(query);
  debug('...done');

  const results = graphRes._results;

  const comments = [];

  for (let i = 0; i < results.length; i++) {

    const user = {
      userId: results[i]._values[0][0][0].properties.userId,
      username: results[i]._values[0][0][0].properties.username,
      name: results[i]._values[0][0][0].properties.name,
      avatar: results[i]._values[0][0][0].properties.avatar
    };

    const commentId = results[i]._values[0][0][1].properties.commentId;
    const comment = results[i]._values[0][0][1].properties.comment;
    const createdAt = results[i]._values[0][0][1].properties.createdAt;
    const responseTo = results[i]._values[0][0][1].properties.responseTo;
    const likes = results[i]._values[0][0][2];
    const liking = results[i]._values[0][0][3];

    let isLiking;

    if (liking > 0) isLiking = true;
    else isLiking = false;

    debug(likes);

    const commentObj = {
      user,
      commentId,
      comment,
      createdAt,
      likeCount: likes,
      isLiking,
      responseTo
    };

    comments.push(commentObj);

  }

  return comments;

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
