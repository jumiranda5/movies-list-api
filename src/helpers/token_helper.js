import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
const debug = require('debug')('app:token');
import config from '../config';
const { TOKEN_SECRET } = config;

// Google
const CLIENT_ID = config.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

export const createAccessToken = (userId, sid) => {

  return new Promise((resolve, reject) => {

    try{
      debug('Creating access token...');
      const payload = { userId, sid };
      const token = jwt.sign(payload, TOKEN_SECRET, {expiresIn: '7d'});
      debug('... done');
      resolve(token);
    }
    catch(error) {
      reject(error);
    }

  });

};

export const verifyAccessToken = (accessToken) => {

  return new Promise((resolve, reject) => {
    try {
      const dec = jwt.verify(accessToken, TOKEN_SECRET);
      debug( `Access token verified.`);
      resolve(dec);
    }
    catch (error) {
      debug("Invalid access token");
      reject("Invalid token");
    }
  });

};

export const verifyGoogleToken = async (token) => {

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userId = payload.sub;
    debug(`Google token verified.`);
    return userId;
  }
  catch (error) {
    debug("Invalid google token");
    const err = new Error('Invalid token.');
    err.status = 401;
    throw err;
  }

};
