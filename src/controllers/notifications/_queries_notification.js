import Notification from '../../database/models/notifications_model';
import User from '../../database/models/user_model';
const debug = require('debug')('app:mongo');

/* ================================================================================================

                                      NOTIFICATIONS - MONGO

================================================================================================= */

export const createNotification = async (sender, target, type) => {

  // to = user id (follow) || post id (post, comment)
  // type: follow || comment || like
  // target_type: user || post || comment

  const notificationObj = {
    type: type,
    target_user_id: target.target_user_id,
    target_id: target.target_id,
    target_type: target.target_type,
    sender_id: sender.sender_id,
    sender_username: sender.sender_username
  };

  try {
    await Notification.create(notificationObj);
    debug(`${type} notification created.`);
  }
  catch (error) {

    debug(`Error code: ${error.code}`);
    debug(`Error message: ${error.message}`);

    //throw error;
  }

};

export const findUserFcmToken = async (targetUserId) => {

  debug(targetUserId);

  try {
    const userObj = ['fcm_token', 'notifications_on'];
    debug('Find user notifications config...');
    const user = await User.findOne({_id: targetUserId}, userObj).exec();

    if (user !== null) {
      debug(user);
      debug(`User fcm token found: ${user.fcm_token}`);
      return user;
    }
    else {
      const err = new Error('Not found.');
      err.status = 404;
      err.message = 'User not found.';
      return null;
    }
  }
  catch(error) {
    debug(error.message);
    return null;
  }

};
