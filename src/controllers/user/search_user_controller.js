import { verifyAccessToken } from '../../helpers/token_helper';
import { isInputDataValid } from '../../middlewares/validation';
import { searchUser } from './_queries_user';
//const debug = require('debug')('app:search-user');

export const search_user = async (req, res, next) => {

  // Android retrofit adding extra quote when sending search key on the request body
  // moved search key to params...

  const search = req.params.search.toLowerCase();
  const page = req.params.page;

  // Validate search query
  const isDataValid = isInputDataValid(req);
  if (!isDataValid) {
    const err = new Error('Validation error.');
    err.status = 422;
    res.status(err.status || 500);
    return res.send({ message: err.message });
  }

  //debug(`Search key: ${search} / Page: ${page}`);

  try {

    const accessToken = req.headers['x-access-token'];
    const dec = await verifyAccessToken(accessToken);

    const userId = dec.userId;
    const users = await searchUser(search, userId, page);

    if(users.length !== 0) {
      return res.json({
        message: `Found users.`,
        result: users
      });
    }
    else return res.json({message: 'No users found.'});

  }
  catch (error) {
    return next(error);
  }

};
