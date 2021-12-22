const debug = require('debug')('app:comment');
import { createComment, createNotification, findUserFcmToken } from './_queries_post';
import { v4 as uuidv4 } from 'uuid';
import { verifyAccessToken } from '../../helpers/token_helper';
const admin = require("firebase-admin");

export const create_comment = async (req, res, next) => {

  const accessToken = req.headers['x-access-token'];
  const postId = req.params.postId;
  const postUserId = req.params.postUserId;
  const responseTo = req.params.responseTo; // post || username
  const commentText = req.body.comment;
  const commentId = uuidv4();

  debug(commentText);

  try {
    const dec = await verifyAccessToken(accessToken);
    const userId = dec.userId;

    debug('Create comment on graph...');
    const comment = await createComment(userId, postId, commentText, commentId, responseTo);

    if (userId !== postUserId) {

      // create notification document
      debug('Create notification document...');
      await createNotification(userId, postId, "comment");

      // send push notification
      const user = await findUserFcmToken(postUserId);
      debug(`===== User => ${user}`);

      const notification_options = { priority: "normal" };

      // message payload.
      /*
      const message = {
        notification: {
          body: `${user.username} commented on your post.`
        },
        data: {
          body: `${user.username} commented on your post.`
        },
        topic: "app"
      };

      admin.messaging()
        .sendToDevice(user.fcm_token, message, notification_options)
        .then( () => { debug('Push notification sent'); });

        */
    }

    return res.json(comment);
  }
  catch(error) {
    debug(error);
    return next(error);
  }

};
