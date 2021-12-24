const admin = require("firebase-admin");
const debug = require('debug')('app:notification');
import { createNotification, findUserFcmToken } from "./_queries_notification";

export const send_notification = async (type, targetUserId, targetType, targetId, senderId, senderUsername, lang) => {

  // type = follow || like || comment || comment_response
  // targetType = user || post || comment

  // get fcm token from server (+ get notifications_on and username from target user document)
  const targetUser = await findUserFcmToken(targetUserId);
  debug(`===== User => ${targetUser}`);

  const fcmToken = targetUser.fcm_token;

  const isNotificationsOn = targetUser.notifications_on;

  const target = {
    target_user_id: targetUserId,
    target_id: targetId,
    target_type: targetType
  };

  const sender = {
    sender_id: senderId,
    sender_username: senderUsername
  };

  // mongo db
  if (targetUserId !== senderId) {
    debug('Create notification document...');
    await createNotification(sender, target, type);
  }

  // fcm
  if (isNotificationsOn && targetUserId !== senderId) {

    const notification_options = {
      priority: "normal"
    };

    const messageEn = {
      notification: {
        body: notificationMessageEn(senderUsername, type, targetType)
      },
      data: {
        body: notificationMessageEn(senderUsername, type, targetType)
      }
    };

    const messagePt = {
      notification: {
        body: notificationMessagePt(senderUsername, type, targetType)
      },
      data: {
        body: notificationMessagePt(senderUsername, type, targetType)
      }
    };

    let message;
    if (lang === "pt-BR" || lang === "pt-PT") message = messagePt;
    else message = messageEn;

    admin.messaging().sendToDevice(fcmToken, message, notification_options)
      .then( () => { debug("Notification sent successfully");})
      .catch( error => { debug(error); });

  }

};

const notificationMessageEn = (senderUsername, type, targetType) => {

  let message;

  switch (type) {
    case 'like': message = `${senderUsername} liked your ${targetType}`; break;
    case 'follow': message = `${senderUsername} followed you.`; break;
    case 'comment': message = `${senderUsername} commented on your post.`; break;
    case 'comment_response': message = `${senderUsername} responded to your comment.`; break;
    default: '';
  }

  return message;
};

const notificationMessagePt = (senderUsername, type, targetType) => {

  let target_type;
  if (targetType === 'post') target_type = 'sua publicação';
  if (targetType === 'comment') target_type = 'seu commentário';

  let message;

  switch (type) {
    case 'like': message = `${senderUsername} curtiu ${target_type}`; break;
    case 'follow': message = `${senderUsername} seguiu você.`; break;
    case 'comment': message = `${senderUsername} comentou na sua publicação.`; break;
    case 'comment_response': message = `${senderUsername} respondeu ao seu comentário.`; break;
    default: '';
  }

  return message;

};
