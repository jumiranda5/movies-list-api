import Post from '../../database/models/post_model';
import Top10 from '../../database/models/top10_model';
import { graphDb } from '../../database/graphConfig';
//const debug = require('debug')('app:mongo');

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
