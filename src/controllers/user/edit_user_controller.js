import { updateUserDocument, updateUserNode } from './_queries_user';
import { verifyAccessToken } from '../../helpers/token_helper';
import { isInputDataValid } from '../../middlewares/validation';
//const debug = require('debug')('app:edit-profile');

export const edit_user = async (req, res, next) => {

  // User data
  const accessToken = req.headers['x-access-token'];
  const name = req.body.name;
  const avatar = req.body.avatar;

  // TODO: validate input data
  const isDataValid = isInputDataValid(req);
  if (!isDataValid) {
    const err = new Error('Validation error.');
    err.status = 422;
    res.status(err.status || 500);
    return res.send({ message: err.message });
  }

  try {

    const dec = await verifyAccessToken(accessToken);
    const userId = dec.userId;

  //  debug(`user id: ${chalk.green(userId)}`);
  //  debug(`new name: ${chalk.green(name)}`);
  //  debug(`new avatar: ${chalk.green(avatar)}`);

    const userData = {
      _id: userId,
      name: name,
      avatar: avatar || ""
    };

    // Update user on db
    const editedUser = await updateUserDocument(userData);
    await updateUserNode(editedUser);

    return res.json(editedUser);

  }
  catch(error) {
    return next(error);
  }

};
