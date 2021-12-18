import { getPostGraph, getPost } from "./_queries_post";
import { verifyAccessToken } from '../../helpers/token_helper';
import { postObject, titleObjectMini } from '../../helpers/response_helper';
const debug = require('debug')('app:post');

export const post = async (req, res, next) => {

  const accessToken = req.headers['x-access-token'];
  const postId = req.params.postId;

  try {

    const dec = await verifyAccessToken(accessToken);
    const userId = dec.userId;

    // Get feed graph

    debug('Get post graph...');
    const feedGraph = await getPostGraph(postId, userId);

    // Get post document from graph ids

    debug('Get post document...');
    const post = await getPost(postId);

    // Reduce top 10 title objects from post response

    if (post.top_10.length > 0) {
      for (let y = 0; y < post.top_10.length; y++) {
        if (post.top_10[y] !== null) post.top_10[y] = titleObjectMini(post.top_10[y], true);
      }
    }

    const postObj = postObject(post);

    // Build feed response object

    const response = [
      {
        post: postObj,
        likeCount: feedGraph.likeCount,
        commentCount: feedGraph.commentCount,
        user: feedGraph.user,
        isLiking: feedGraph.isLiking,
        isOwnPost: feedGraph.isOwnPost
      }
    ];

    return res.json({
      feed: response
    });
  }
  catch (error) {
    return next(error);
  }

};
