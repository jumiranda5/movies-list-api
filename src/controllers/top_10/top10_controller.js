import { verifyAccessToken } from '../../helpers/token_helper';
import { findTop10 } from './_queries_top10';
const debug = require('debug')('app:top10');

export const top10 = async (req, res, next) => {

  try {

    const type = req.params.type; // tv || movie

    const accessToken = req.headers['x-access-token'];
    const dec = await verifyAccessToken(accessToken);

    const top10Document = await findTop10(dec.userId, type);

    if (top10Document) {

      debug(top10Document);

      return res.json({
        message: 'Top 10 document found',
        series: top10Document.series,
        movies: top10Document.movies
      });
    }
    else {
      return res.json({
        message: 'Top 10 document not found'
      });
    }

  }
  catch (error) {
    return next(error);
  }

};
