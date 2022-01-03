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
    sender_username: sender.sender_username,
    createdAt: Date.now() // default Date.now() not working properly on Model
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

export const getNewNotificationsCount = async (userId) => {

  const newNotificationsCount = await Notification.countDocuments({target_user_id: userId, seen: false});
  debug(`found ${newNotificationsCount} new notifications`);

  return newNotificationsCount;

};

export const getNotifications = async (userId, page) => {

  const nPerPage = 20;
  const nSkip = page > 0 ? ( ( page - 1 ) * nPerPage ) : 0;

  const notifications = Notification.find(
    {target_user_id: userId},
    ['type', 'sender_username', 'sender_id', 'target_type', 'target_id', 'seen'])
    .sort({createdAt: -1})
    .limit(nPerPage)
    .skip(nSkip)
    .exec();

  return notifications;

};

export const updateSeenNotifications = async (userId) => {

  const query = { target_user_id: userId, seen: false};
  const options = { new: false };
  const update = { $set: { seen: true }};

  const notifications = Notification.updateMany(query, update, options);

  return notifications;

};

export const updateNotificationsPrefs = async (userId, value) => {

  let prefs;
  if (value === "true") prefs = true;
  else prefs = false;

  const query = { _id: userId};
  const options = { new: false };
  const update = { $set: { notifications_on: prefs }};

  try {
    debug(`Updating user...`);
    await User.findOneAndUpdate(query, update, options).exec();

    return true;
  }
  catch (error) {
    if (error.code === 11000) {
      const err = new Error(`Username must be unique`);
      err.status = 409 ;
      //debug(err.message);
      throw err;
    }
    else throw error;
  }

};
