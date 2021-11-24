const debug = require('debug')('app:delete-post');
import { verifyAccessToken } from '../../helpers/token_helper';
import { deletePostDocument, deletePostNode } from './_queries_post';

export const delete_post = async (req, res, next) => {

  const accessToken = req.headers['x-access-token'];
  const postId = req.params.postId;

  try {
    const dec = await verifyAccessToken(accessToken);
    const userId = dec.userId;

    await deletePostDocument(postId, userId);
    await deletePostNode(postId);

    return res.json({message: 'Success'});

  }
  catch (error) {
    return next(error);
  }

};
