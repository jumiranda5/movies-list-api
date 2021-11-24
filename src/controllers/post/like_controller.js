const debug = require('debug')('app:like');
import { verifyAccessToken } from '../../helpers/token_helper';
import { createLike } from './_queries_post';

export const like = async (req, res, next) => {

  /*
    LIKES:
      user => post
      user => comment
  */

  const type = req.params.type; // post || comment
  const postId = req.params.postId; // post || comment id
  const accessToken = req.headers['x-access-token'];

  try {

    const dec = await verifyAccessToken(accessToken);
    const userId = dec.userId;

    debug('Create like on graph...');
    await createLike(userId, postId, type);
    return res.json({message: 'Success'});
  }
  catch(error) {
    return next(error);
  }

}
