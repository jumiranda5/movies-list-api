const debug = require('debug')('app:comment');
import { deleteComment } from './_queries_post';

export const delete_comment = async (req, res, next) => {

  // Todo: only allow deletion if comment or post belongs to user
  //const userId = req.params.userId; // todo: get user id from access token
  const commentId = req.params.commentId;

  try {
    debug('Delete comment on graph...');
    await deleteComment(commentId);
    return res.json({message: 'Success'});
  }
  catch(error) {
    debug(error);
    return next(error);
  }

}
