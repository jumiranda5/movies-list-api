const debug = require('debug')('app:like');
import { verifyAccessToken } from '../../helpers/token_helper';
import { createLike } from './_queries_post';
import { send_notification } from '../notifications/create_notification';

export const like = async (req, res, next) => {

  const likeType = req.params.type; // post || comment (like type...)
  const targetId = req.params.targetId; // post id || comment id
  const targetUserId = req.params.targetUserId;
  const senderUsername = req.params.senderUsername;
  const postId = req.params.postId;
  const lang = req.params.lang;
  const accessToken = req.headers['x-access-token'];

  try {

    const dec = await verifyAccessToken(accessToken);
    const userId = dec.userId;

    // create like in graph db
    debug('Create like on graph...');
    await createLike(userId, targetId, likeType);

    // target id must be the post id => like notification item opens post page
    debug('Create notification document and send push...');
    await send_notification("like", targetUserId, likeType, postId, userId, senderUsername, lang);

    return res.json({message: 'Success'});

  }
  catch(error) {
    return next(error);
  }

};
