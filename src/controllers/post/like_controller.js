const debug = require('debug')('app:like');
import { verifyAccessToken } from '../../helpers/token_helper';
import { createLike, createNotification, findUserFcmToken } from './_queries_post';
const admin = require("firebase-admin");

export const like = async (req, res, next) => {

  /*
    LIKES:
      user => post
      user => comment
  */

  const type = req.params.type; // post || comment
  const postId = req.params.postId; // post || comment id
  const targetUserId = req.params.targetUserId;
  //const accessToken = req.headers['x-access-token'];

  try {

    //const dec = await verifyAccessToken(accessToken);
    const userId = "616b003821f6b937d9e4473e";//dec.userId;

    // create like in graph db
    debug('Create like on graph...');
    await createLike(userId, postId, type);

    // create notification document
    debug('Create notification document...');
    await createNotification(userId, postId, type);

    // send push notification
    const user = await findUserFcmToken(targetUserId);
    debug(`===== User => ${user}`);

    const notification_options = { priority: "normal" };

    // message payload.
    const message = {
      notification: {
        body: `${user.username} liked your ${type}.`
      },
      data: {
        body: `${user.username} liked your ${type}.`
      }
    };

    admin.messaging()
      .sendToDevice(user.fcm_token, message, notification_options)
      .then( response => { debug('Push notification sent'); });

    return res.json({message: 'Success'});

  }
  catch(error) {
    return next(error);
  }

}
