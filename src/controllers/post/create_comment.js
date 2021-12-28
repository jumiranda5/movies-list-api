const debug = require('debug')('app:comment');
import { createComment } from './_queries_post';
import { v4 as uuidv4 } from 'uuid';
import { verifyAccessToken } from '../../helpers/token_helper';
import { send_notification } from '../notifications/create_notification';

export const create_comment = async (req, res, next) => {

  const accessToken = req.headers['x-access-token'];
  const postId = req.params.postId;
  const postUserId = req.params.postUserId;
  const responseTo = req.params.responseTo; // post || username
  const senderUsername = req.params.senderUsername;
  const lang = req.params.lang;
  const commentText = req.body.comment;
  const commentId = uuidv4();

  debug(commentText);

  let type;
  let targetType;
  if (responseTo === 'post') {
    type = 'comment';
    targetType = 'post';
  }
  else {
    type = 'comment_response';
    targetType = 'comment';
  }

  try {
    const dec = await verifyAccessToken(accessToken);
    const userId = dec.userId;

    debug('Create comment on graph...');
    const comment = await createComment(userId, postId, commentText, commentId, responseTo);

    debug('Create notification document and send push...');
    await send_notification(type, postUserId, targetType, postId, userId, senderUsername, lang);

    return res.json(comment);
  }
  catch(error) {
    debug(error);
    return next(error);
  }

};
