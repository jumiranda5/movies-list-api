import { findLikes } from './_queries_post';
import { verifyAccessToken } from '../../helpers/token_helper';
//const debug = require('debug')('app:likes');

export const get_likes = async (req, res, next) => {

  const id = req.params.id;
  const page = req.params.page;
  const type = req.params.type; // post || comment
  const accessToken = req.headers['x-access-token'];

  try {

    const dec = await verifyAccessToken(accessToken);
    const userId = dec.userId;

    const likesList = await findLikes(id, userId, page, type);

    return res.json({
      message: 'Success',
      result: likesList
    });

  }
  catch (error) {
    return next(error);
  }


};
