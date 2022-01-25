//const debug = require('debug')('app:delete-post');
import { verifyAccessToken } from '../../helpers/token_helper';
import { deletePostDocument, deletePostReaction } from './_queries_reactions';

export const delete_reaction = async (req, res, next) => {

  const accessToken = req.headers['x-access-token'];
  const titleId = req.params.titleId;

  try {
    const dec = await verifyAccessToken(accessToken);
    const userId = dec.userId;

    await deletePostDocument(titleId, userId);
    await deletePostReaction(userId, titleId);

    return res.json({message: 'Success'});

  }
  catch (error) {
    return next(error);
  }

};
