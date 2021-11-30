import Top10 from '../../database/models/top10_model';
const debug = require('debug')('app:top10-queries');

/* ================================================================================================

                                            TOP 10

================================================================================================= */

export const findTop10 = async (userId, type) => {

  let top10Obj;

  if (type === 'movie') top10Obj = ['movies'];
  else if (type ==='tv') top10Obj = ['series'];
  else top10Obj = ['movies', 'series'];

  const top10 = await Top10.findOne({_id: userId}, top10Obj).exec();

  if (top10 !== null) {
    debug(`top 10 document found.`);
    return top10;
  }
  else {
    debug('Top 10 document not found');
    return null;
  }

};
