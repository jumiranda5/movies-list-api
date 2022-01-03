import DevMessage from '../database/models/dev_message';

export const send_message_to_dev = async (req, res, next) => {

  const email = req.body.email;
  const username = req.body.username;
  const userId = req.body.userId;
  const message = req.body.message;

  const messageObj = {
    email,
    username,
    userId,
    message
  }

  try {

    await DevMessage.create(messageObj);

    return res.json({message: 'Success'});

  }
  catch (error) {

    return next(error);

  }


};
