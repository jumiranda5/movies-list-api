const debug = require('debug')('app:comments');
import { getComments } from './_queries_post';
import { verifyAccessToken } from '../../helpers/token_helper';

export const comments = async (req, res, next) => {

  const accessToken = req.headers['x-access-token'];
  const postId = req.params.postId;
  const page = req.params.page;

  debug(postId);

  try {

    const dec = await verifyAccessToken(accessToken);
    const userId = dec.userId;

    debug('Get comments...');
    const comments = await getComments(postId, userId, page);
    return res.json({message: 'Success', comments: comments});

  }
  catch(error) {
    debug(error);
    return next(error);
  }

};
