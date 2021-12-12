const admin = require("firebase-admin");

export const send_notification = async (req, res, next) => {

  // get fcm token from server (from target user document)
  // get username and user id

  const  registrationToken = req.params.registrationToken;
  //const messageType = req.body.messageType

  const notification_options = {
    priority: "high"
  };

  // See documentation on defining a message payload.
  const message = {
    notification: {
      body: 'username liked your post.'
    },
    data: {
      body: 'username liked your post.'
    }
  };

  admin.messaging().sendToDevice(registrationToken, message, notification_options)
    .then( response => {

      return res.json({message:"Notification sent successfully"});

    })
    .catch( error => { return next(error); });

};
