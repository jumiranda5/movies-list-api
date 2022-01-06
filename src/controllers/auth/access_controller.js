import { verifyAccessToken } from "../../helpers/token_helper";
import { findUserSid } from './_queries_auth';
const debug = require('debug')('app:access');

export const access = async (req, res) => {

  /**
   * If access-token => verify
   * else => user not logged in
   */

  if (req.headers['x-access-token']) {

    debug('Session header found. Verify token...');
    const accessToken = req.headers['x-access-token'];

    try {
      const access_token_dec = await verifyAccessToken(accessToken);
      debug('Valid access token');

      // verify sid on db
      const userId = access_token_dec.userId;
      const current_sid = await findUserSid(userId);

      debug(`current sid: ${current_sid}`);
      debug(`access sid: ${access_token_dec.sid}`);

      if (current_sid === access_token_dec.sid) return res.json({message: 'Valid access token'});
      else return res.json({message: 'Invalid access token'});

    }
    catch (error) {
      debug('Invalid access token');
      return res.json({message: 'Invalid access token'});
    }

  }
  else {
    debug(`User not logged in.`);
    //return res.json({message: 'No access token'});
    return res.json({message: 'Test access token'});
  }

};
