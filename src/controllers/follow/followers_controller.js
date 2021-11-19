import { findFollowers } from './_queries_follow';
import { verifyAccessToken } from '../../helpers/token_helper';
//const debug = require('debug')('app:followers');

export const followers = async (req, res, next) => {

  const userId = req.params.userId;
  const page = req.params.page;
  const accessToken = req.headers['x-access-token'];

  //debug('Searching followers ...');

  try {

    const dec = await verifyAccessToken(accessToken);
    const visitorId = dec.userId;

    const followersList = await findFollowers(userId, page, visitorId);

    return res.json({
      message: `Found ${followersList.length} followers.`,
      result: followersList
    });

  }
  catch (error) {
    return next(error);
  }

};
