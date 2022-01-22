import { createPostDocument, createPostReaction } from './_queries_post';
import { verifyAccessToken } from '../../helpers/token_helper';
const debug = require('debug')('app:post');

export const create_post = async (req, res, next) => {

  // post type: reaction || recommendations || top_10 => removed recommendations and top 10 for now...
  // media type: tv || movie

  const postType = req.params.type;
  const mediaType = req.body.mediaType;
  const reaction = req.body.reaction;
  const title = req.body.title;

  let titleData;
  if (title) {
    titleData = {
      _id: title.tmdb_id,
      type: title.type,
      title: title.title,
      release_year: title.release_year,
      overview: title.overview,
      genre: title.genre,
      poster: title.poster
    };
  }

  // save post document on mongo db
  // reaction => save title node and reaction relashionship on graph (type && tmdb id). Save post node on graph

  try {

    const accessToken = req.headers['x-access-token'];
    const dec = await verifyAccessToken(accessToken);

    const reactionData = {
      userId: dec.userId,
      post_type: postType,
      media_type: mediaType,
      tmdb_id: titleData._id,
      title: titleData,
      reaction: reaction,
    };

    debug(`Post data: ${JSON.stringify(reactionData)}`);

    await createPostDocument(reactionData);

    await createPostReaction(reactionData);

    return res.json({ message: 'Success' });

  }
  catch (error){
    return next(error);
  }

};
