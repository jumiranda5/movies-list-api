import { getFeedGraph, getPosts } from './_queries_post';
import { verifyAccessToken } from '../../helpers/token_helper';
import { postObject } from '../../helpers/response_helper';
const debug = require('debug')('app:feed');

export const feed = async (req, res, next) => {

  const accessToken = req.headers['x-access-token'];
  const page = req.params.page;

  try {

    const dec = await verifyAccessToken(accessToken);
    const userId = dec.userId;

    // Get feed graph

    debug('Get graph...');
    const feedGraph = await getFeedGraph(userId, page);

    // Get posts documents from graph ids

    debug('Get posts documents...');
    const posts = await getPosts(feedGraph.posts);

    // Build feed response object

    const feedResponse = [];

    for (let i = 0; i < posts.length; i++) {

      const post_user_id = posts[i].userId;
      const user = feedGraph.feed.find(u => {
        return post_user_id === u.user.userId;
      });

      const post = postObject(posts[i]);

      const postCreatedAt = posts[i].createdAt;
      const postUpdatedAt = posts[i].updatedAt;

      let createdAt;
      if (postCreatedAt && postUpdatedAt) {
        if (postUpdatedAt > postCreatedAt) createdAt = postUpdatedAt;
      }
      else createdAt = postCreatedAt;

      let isOwnPost = false;
      if (userId === user.userId) isOwnPost = true;

      const feedObj = {
        post,
        user: user.user,
        isOwnPost,
        createdAt
      };

      feedResponse.push(feedObj);


    }

    debug(feedResponse);

    return res.json({
      feed: feedResponse
    });
  }
  catch (error) {
    return next(error);
  }

};
