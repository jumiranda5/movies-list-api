import { verifyAccessToken } from '../../helpers/token_helper';
import { deleteUserDocument, deleteNotifications, deleteUserGraph } from './_queries_auth';
import { deleteTop10 } from '../top_10/_queries_top10';
import { deleteAllPostsDocuments } from '../post/_queries_post';
const debug = require('debug')('app:delete_account');

export const delete_account = async (req, res) => {

  debug('Deleting account...');

  try {

    const accessToken = req.headers['x-access-token'];
    const dec = await verifyAccessToken(accessToken);
    const userId = dec.userId;

    // delete user, notifications, top10, posts, watchlist documents
    await deleteUserDocument(userId);
    await deleteNotifications(userId);
    await deleteTop10(userId);
    await deleteAllPostsDocuments(userId);

    // delete user graph => nodes (user, posts, comments) + edges (detatch)
    await deleteUserGraph(userId);

    return res.json({message: 'Success'});

  }
  catch(error) {
    debug(error);
    res.status(error.status || 500);
    return res.send({ message: error.message });
  }

};
