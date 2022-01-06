import { createAccessToken, verifyGoogleToken } from '../../helpers/token_helper';
import { checkIfUserExists, updateUserSid, findTestUser } from './_queries_auth';
import { v4 as uuidv4 } from 'uuid';
const debug = require('debug')('app:login');

export const login = async (req, res) => {


  /**
   *  For Google Play app review =>
   *  - x-auth-token = test
   *  - login with dev account (send dev credentials)
   */

  const authToken = req.headers['x-auth-token'];

  if (authToken === "test") {

    try {

      debug('Test User login...')

      const testUser = await findTestUser();
      const testSid = '7315c415-8b37-4142-b72e-4e97321b838e';
      const test_access_token = await createAccessToken(testUser._id, testSid);

      return res.header("x-access-token", test_access_token).json({
        message: 'User logged in',
        userId: testUser._id,
        username: testUser.username,
        name: testUser.name,
        avatar: testUser.avatar,
      });

    }
    catch(error) {
      debug(error);
      res.status(error.status || 500);
      return res.send({ message: error.message });
    }

  }
  else {

    debug('Login...');

    try {

      const googleId = await verifyGoogleToken(authToken);
      const savedUser = await checkIfUserExists(googleId);

      if (savedUser) {

        debug(`User found: ${savedUser.username}`);
        debug(`Create access token...`);

        const sid = uuidv4();
        const access_token = await createAccessToken(savedUser._id, sid);
        await updateUserSid(savedUser._id, sid);

        debug('User logged in.');

        return res.header("x-access-token", access_token).json({
          message: 'User logged in',
          userId: savedUser._id,
          username: savedUser.username,
          name: savedUser.name,
          avatar: savedUser.avatar,
        });
      }
      else {
        debug('User not found.');
        res.status(401);
        return res.send({ message: 'User not found.' });
      }

    }
    catch(error) {
      debug(error);
      res.status(error.status || 500);
      return res.send({ message: error.message });
    }

  }

};
