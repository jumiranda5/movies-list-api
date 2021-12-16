const debug = require('debug')('app:fcm-token');
import { verifyGoogleToken } from '../../helpers/token_helper';
import { updateUserFcmToken } from './_queries_auth';

export const save_fcm_token = async (req, res, next) => {

  const authToken = req.headers['x-auth-token'];
  const fcm_token = req.headers['x-fcm-token'];

  try {

    debug('Verify google auth token.');
    const googleId = await verifyGoogleToken(authToken);
    await updateUserFcmToken(googleId, fcm_token);

    return res.json({messsage: 'Success!'});

  }
  catch (error) {
    return next(error);
  }

};
