import { v4 as uuidv4 } from 'uuid';
import { isInputDataValid } from '../../middlewares/validation';
import { createUserDocument, deleteUserDocument, createUserNode } from './_queries_auth';
import { createAccessToken, verifyGoogleToken } from '../../helpers/token_helper';
const debug = require('debug')('app:signup');

export const signup = async (req, res, next) => {

  // Input data
  const userData = {
    name: req.body.name,
    username: req.body.username,
    avatar: req.body.avatar,
    email: req.body.email
  };

  // Validate input data
  const isDataValid = isInputDataValid(req);
  if (!isDataValid) {
    const err = new Error('Validation error.');
    err.status = 422;
    res.status(err.status || 500);
    return res.send({ message: err.message });
  }

  try {

    debug('Sign up...');

    // Verify Google token
    const authToken = req.headers['x-auth-token'];
    const googleId = await verifyGoogleToken(authToken);

    // Fcm
    const fcmToken = req.headers['x-fcm-token'];

    // Create session id (sid)
    const sid = uuidv4();

    const user = {
      google_id: googleId,
      name: userData.name,
      username: userData.username,
      email: userData.email,
      avatar: userData.avatar || '',
      sid: sid,
      fcm_token: fcmToken || ''
    };

    // Create user document and node
    const search = `${user.username} ${user.name}`;
    const newUser = await createUserDocument(user);
    const isUserNodeCreated = await createUserNode(newUser, search);

    if (!isUserNodeCreated) {
      await deleteUserDocument(newUser._id);
      const err = new Error(`User node not created.`);
      err.status = 500;
      debug(err.message);
      return next(err);
    }
    else {
      const access_token = await createAccessToken(newUser._id, newUser.sid);

      debug(`User ${newUser.username} successfully signed up and logged in!`);

      return res.header("x-access-token", access_token).json({
        message: 'User successfully created and logged in!',
        userId: newUser._id,
        username: newUser.username,
        name: newUser.name,
        avatar: newUser.avatar
      });
    }

  }
  catch (error) {
    debug(error);
    res.status(error.status || 500);
    return res.send({ message: error.message });
  }

};
