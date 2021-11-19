import { findFollowing } from './_queries_follow';
import { verifyAccessToken } from '../../helpers/token_helper';
//const debug = require('debug')('app:following');

export const following = async (req, res, next) => {

  const userId = req.params.userId;
  const page = req.params.page;
  const accessToken = req.headers['x-access-token'];

  //debug('Searching following ...');

  try {

    const dec = await verifyAccessToken(accessToken);
    const visitorId = dec.userId;

    const followingList = await findFollowing(userId, page, visitorId);

    return res.json({
      message: `Found ${followingList.length} following.`,
      result: followingList
    });

  }
  catch (error) {
    return next(error);
  }

};
