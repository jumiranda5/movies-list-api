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

export const deletePostDocument = async (titleId, userId) => {

  debug('Deleting post document...');
  const del = await Post.deleteOne({userId: userId, tmdb_id: titleId});
  debug('...done');

  const count = del.deletedCount;

  if (count === 0) {
    const error = new Error(`${titleId} not found`);
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
    let total;

    switch (i) {
      case 0: reactions = r1.reactionsList; total = r1.total; break;
      case 1: reactions = r2.reactionsList; total = r2.total; break;
      case 2: reactions = r3.reactionsList; total = r3.total; break;
      case 3: reactions = r4.reactionsList; total = r4.total; break;
      case 4: reactions = r5.reactionsList; total = r5.total; break;
      case 5: reactions = r6.reactionsList; total = r6.total; break;
      case 6: reactions = r7.reactionsList; total = r7.total; break;
      case 7: reactions = r8.reactionsList; total = r8.total; break;
      case 8: reactions = r9.reactionsList; total = r9.total; break;
      case 9: reactions = r10.reactionsList; total = r10.total; break;
      case 10: reactions = r11.reactionsList; total = r11.total; break;
      case 11: reactions = r12.reactionsList; total = r12.total; break;
      case 12: reactions = r13.reactionsList; total = r13.total; break;
      case 13: reactions = r14.reactionsList; total = r14.total; break;
      case 14: reactions = r15.reactionsList; total = r15.total; break;
      case 15: reactions = r16.reactionsList; total = r16.total; break;
      case 16: reactions = r17.reactionsList; total = r17.total; break;
      case 17: reactions = r18.reactionsList; total = r18.total; break;
      case 18: reactions = r19.reactionsList; total = r19.total; break;
      case 19: reactions = r20.reactionsList; total = r20.total; break;
      default: reactions = []; total = 0;
    }

    const position = i + 1;

    const data = {
      title: trendingList[i].title,
      tmdb_id: trendingList[i].tmdb_id,
      type: trendingList[i].type,
      poster: trendingList[i].poster,
      isBookmarked: trendingList[i].isBookmarked,
      overview: trendingList[i].overview,
      release_year: trendingList[i].release_year,
      genre: trendingList[i].genre,
      reactions: reactions,
      totalReactions: total,
      position: position
    };

    trendingWithReactions.push(data);

  }

  return trendingWithReactions;

};

const createReactionsList = (reactions) => {

  const reactionsList = [];
  let total = 0;

  for (let i = 0; i < reactions.length; i++) {

    const reaction = {
      reaction: reactions[i]._id.reaction,
      count: reactions[i].count
    };

    total = total + reactions[i].count;

    reactionsList.push(reaction);

  }

  const reactionObject = {
    reactionsList: reactionsList,
    total: total
  };

  return reactionObject;
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
