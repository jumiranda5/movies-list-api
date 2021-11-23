import { findLikes } from './_queries_post';
import { verifyAccessToken } from '../../helpers/token_helper';
//const debug = require('debug')('app:likes');

export const get_likes = async (req, res, next) => {

  const postId = req.params.postId;
  const page = req.params.page;
  const accessToken = req.headers['x-access-token'];

  try {

    const dec = await verifyAccessToken(accessToken);
    const userId = dec.userId;

    const likesList = await findLikes(postId, userId, page);

    return res.json({
      message: 'Success',
      result: likesList
    });

  }
  catch (error) {
    return next(error);
  }


};
