import { verifyAccessToken } from '../../helpers/token_helper';
import { createFollow } from './_queries_follow';
//const debug = require('debug')('app:follow');

export const follow = async (req, res, next) => {

  try {

    const accessToken = req.headers['x-access-token'];
    const dec = await verifyAccessToken(accessToken);
    const from = dec.userId;
    const to = req.params.to;

    // create follow relatioship on graph
    await createFollow(from, to);

    //debug('Follow relationship created!');
    //debug(`User: ${ from } following ${ to }`);

    // todo: create notification on mongo

    return res.json({
      message: `Following`,
    });
  }
  catch (error){
    return next(error);
  }

};
