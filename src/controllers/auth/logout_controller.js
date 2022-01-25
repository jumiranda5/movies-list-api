import { verifyAccessToken } from '../../helpers/token_helper';
import { updateUserSid } from './_queries_auth';
const debug = require('debug')('app:logout');

export const logout = async (req, res) => {

  debug('Logging out...');

  try {

    const accessToken = req.headers['x-access-token'];
    const dec = await verifyAccessToken(accessToken);
    const userId = dec.userId;

    await updateUserSid(userId, 'logged out');

    return res.json({message: 'Success'});

  }
  catch(error) {
    debug(error);
    res.status(error.status || 500);
    return res.send({ message: error.message });
  }

};
