import { verifyAccessToken } from '../../helpers/token_helper';
import { createFollow } from './_queries_follow';
import { send_notification } from '../notifications/create_notification';
const debug = require('debug')('app:follow');

export const follow = async (req, res, next) => {

  try {

    const accessToken = req.headers['x-access-token'];
    const dec = await verifyAccessToken(accessToken);
    const from = dec.userId;
    const to = req.params.to;
    const senderUsername = req.params.senderUsername;
    const lang = req.params.lang;

    // create follow relatioship on graph
    await createFollow(from, to);

    // create notification
    debug('Create notification document and send push...');
    await send_notification('follow', to, 'user', to, from, senderUsername, lang);

    return res.json({
      message: `Following`,
    });
  }
  catch (error){
    return next(error);
  }

};
