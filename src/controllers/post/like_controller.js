const debug = require('debug')('app:like');
import { verifyAccessToken } from '../../helpers/token_helper';
import { createLike } from './_queries_post';
import { send_notification } from '../notifications/create_notification';

export const like = async (req, res, next) => {

  const likeType = req.params.type; // post || comment (like type...)
  const targetId = req.params.postId; // post || comment id
  const targetUserId = req.params.targetUserId;
  const senderUsername = req.params.senderUsername;
  const lang = req.params.lang;
  const accessToken = req.headers['x-access-token'];

  try {

    const dec = await verifyAccessToken(accessToken);
    const userId = dec.userId;

    // create like in graph db
    debug('Create like on graph...');
    await createLike(userId, targetId, likeType);

    debug('Create notification document and send push...');
    await send_notification("like", targetUserId, likeType, targetUserId, userId, senderUsername, lang);

    return res.json({message: 'Success'});

  }
  catch(error) {
    return next(error);
  }

};
