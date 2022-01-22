import Post from '../../database/models/post_model';
import { graphDb } from '../../database/graphConfig';
const debug = require('debug')('app:post-queries');

/* ================================================================================================

                                           MONGO

================================================================================================= */

export const createPostDocument = async (postData) => {

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

// Trending reactions

export const getTrending = async (trendingList) => {

  debug(`tmdb_id: ${trendingList[2].tmdb_id}`);

  const counts = await Post.aggregate([
    { $facet: {
      "one": [
        { $match: { "tmdb_id": `${trendingList[0].tmdb_id}` } },
        { $group: { _id: { reaction: "$reaction" }, count: { $sum: 1 } } },
      ],
      "two": [
        { $match: { "tmdb_id": `${trendingList[1].tmdb_id}` } },
        { $group: { _id: { reaction: "$reaction" }, count: { $sum: 1 } } },
      ],
      "three": [
        { $match: { "tmdb_id": `${trendingList[2].tmdb_id}` } },
        { $group: { "_id": { reaction: "$reaction" }, count: { $sum: 1 } } },
      ],
      "four": [
        { $match: { "tmdb_id": `${trendingList[3].tmdb_id}` } },
        { $group: { _id: { reaction: "$reaction" }, count: { $sum: 1 } } },
      ],
      "five": [
        { $match: { "tmdb_id": `${trendingList[4].tmdb_id}` } },
        { $group: { _id: { reaction: "$reaction" }, count: { $sum: 1 } } },
      ],
      "six": [
        { $match: { "tmdb_id": `${trendingList[5].tmdb_id}` } },
        { $group: { _id: { reaction: "$reaction" }, count: { $sum: 1 } } },
      ],
      "seven": [
        { $match: { "tmdb_id": `${trendingList[6].tmdb_id}` } },
        { $group: { _id: { reaction: "$reaction" }, count: { $sum: 1 } } },
      ],
      "eight": [
        { $match: { "tmdb_id": `${trendingList[7].tmdb_id}` } },
        { $group: { _id: { reaction: "$reaction" }, count: { $sum: 1 } } },
      ],
      "nine": [
        { $match: { "tmdb_id": `${trendingList[8].tmdb_id}` } },
        { $group: { _id: { reaction: "$reaction" }, count: { $sum: 1 } } },
      ],
      "ten": [
        { $match: { "tmdb_id": `${trendingList[9].tmdb_id}` } },
        { $group: { _id: { reaction: "$reaction" }, count: { $sum: 1 } } },
      ],
      "eleven": [
        { $match: { "tmdb_id": `${trendingList[10].tmdb_id}` } },
        { $group: { _id: { reaction: "$reaction" }, count: { $sum: 1 } } },
      ],
      "twelve": [
        { $match: { "tmdb_id": `${trendingList[11].tmdb_id}` } },
        { $group: { _id: { reaction: "$reaction" }, count: { $sum: 1 } } },
      ],
      "thirteen": [
        { $match: { "tmdb_id": `${trendingList[12].tmdb_id}` } },
        { $group: { _id: { reaction: "$reaction" }, count: { $sum: 1 } } },
      ],
      "fourteen": [
        { $match: { "tmdb_id": `${trendingList[13].tmdb_id}` } },
        { $group: { _id: { reaction: "$reaction" }, count: { $sum: 1 } } },
      ],
      "fifteen": [
        { $match: { "tmdb_id": `${trendingList[14].tmdb_id}` } },
        { $group: { _id: { reaction: "$reaction" }, count: { $sum: 1 } } },
      ],
      "sixteen": [
        { $match: { "tmdb_id": `${trendingList[15].tmdb_id}` } },
        { $group: { _id: { reaction: "$reaction" }, count: { $sum: 1 } } },
      ],
      "seventeen": [
        { $match: { "tmdb_id": `${trendingList[16].tmdb_id}` } },
        { $group: { _id: { reaction: "$reaction" }, count: { $sum: 1 } } },
      ],
      "eighteen": [
        { $match: { "tmdb_id": `${trendingList[17].tmdb_id}` } },
        { $group: { _id: { reaction: "$reaction" }, count: { $sum: 1 } } },
      ],
      "nineteen": [
        { $match: { "tmdb_id": `${trendingList[18].tmdb_id}` } },
        { $group: { _id: { reaction: "$reaction" }, count: { $sum: 1 } } },
      ],
      "twenty": [
        { $match: { "tmdb_id": `${trendingList[19].tmdb_id}` } },
        { $group: { _id: { reaction: "$reaction" }, count: { $sum: 1 } } },
      ]
    }}
  ]);

  const r1 = createReactionsList(counts[0].one);
  const r2 = createReactionsList(counts[0].two);
  const r3 = createReactionsList(counts[0].three);
  const r4 = createReactionsList(counts[0].four);
  const r5 = createReactionsList(counts[0].five);

  const r6 = createReactionsList(counts[0].six);
  const r7 = createReactionsList(counts[0].seven);
  const r8 = createReactionsList(counts[0].eight);
  const r9 = createReactionsList(counts[0].nine);
  const r10 = createReactionsList(counts[0].ten);

  const r11 = createReactionsList(counts[0].eleven);
  const r12 = createReactionsList(counts[0].twelve);
  const r13 = createReactionsList(counts[0].thirteen);
  const r14 = createReactionsList(counts[0].fourteen);
  const r15 = createReactionsList(counts[0].fifteen);

  const r16 = createReactionsList(counts[0].sixteen);
  const r17 = createReactionsList(counts[0].seventeen);
  const r18 = createReactionsList(counts[0].eighteen);
  const r19 = createReactionsList(counts[0].nineteen);
  const r20 = createReactionsList(counts[0].twenty);

  const trendingWithReactions = [];

  for (let i = 0; i < trendingList.length; i++) {

    let reactions;

    switch (i) {
      case 0: reactions = r1; break;
      case 1: reactions = r2; break;
      case 2: reactions = r3; break;
      case 3: reactions = r4; break;
      case 4: reactions = r5; break;
      case 5: reactions = r6; break;
      case 6: reactions = r7; break;
      case 7: reactions = r8; break;
      case 8: reactions = r9; break;
      case 9: reactions = r10; break;
      case 10: reactions = r11; break;
      case 11: reactions = r12; break;
      case 12: reactions = r13; break;
      case 13: reactions = r14; break;
      case 14: reactions = r15; break;
      case 15: reactions = r16; break;
      case 16: reactions = r17; break;
      case 17: reactions = r18; break;
      case 18: reactions = r19; break;
      case 19: reactions = r20; break;
      default: reactions = [];
    }

    const data = {
      title: trendingList[i].title,
      tmdb_id: trendingList[i].tmdb_id,
      type: trendingList[i].type,
      poster: trendingList[i].poster,
      isBookmarked: trendingList[i].isBookmarked,
      reactions: reactions
    };

    trendingWithReactions.push(data);

  }

  return trendingWithReactions;

}

const createReactionsList = (reactions) => {

  const reactionsList = [];

  for (let i = 0; i < reactions.length; i++) {

    const reaction = {
      reaction: reactions[i]._id.reaction,
      count: reactions[i].count
    };

    reactionsList.push(reaction);

  }

  return reactionsList;
};

/* ================================================================================================

                                              GRAPH

================================================================================================= */

export const createPostReaction = async (postData) => {

  const userId = postData.userId;
  const titleId = postData.title._id;
  const reaction = postData.reaction;
  const createdAt = Date.now();

  await graphDb.query(`
    MATCH (from:User {userId: '${userId}'})
    MERGE (to:Title { titleId: '${titleId}' })
    MERGE (from)-[r:REACTED]->(to)
    SET r.createdAt ='${createdAt}'
    SET r.reaction ='${reaction}'
  `);

};

export const deletePostReaction = async (userId, titleId) => {

  await graphDb.query(`
    MATCH (u:User{userId:'${userId}'})-[r:REACTED]->(t:Title{titleId:'${titleId}'})
    DELETE r
  `);

};
