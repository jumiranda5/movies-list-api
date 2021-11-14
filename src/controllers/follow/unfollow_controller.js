//const debug = require('debug')('app:follow');
import { verifyAccessToken } from '../../helpers/token_helper';
import { deleteFollow } from './_queries_follow';

export const unfollow = async (req, res, next) => {

  try {

    const accessToken = req.headers['x-access-token'];
    const dec = await verifyAccessToken(accessToken);
    const from = dec.userId;
    const to = req.params.to;

    await deleteFollow(from, to);
    //debug(`User ${to} unfollowed!`);

    return res.json({
      message: `Unfollowed`,
    });
  }
  catch (error){
    return next(error);
  }

};
