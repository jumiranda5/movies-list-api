import { getFeedGraph, getPosts } from './_queries_post';
import { verifyAccessToken } from '../../helpers/token_helper';
import { postObject, titleObjectMini } from '../../helpers/response_helper';
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
    const posts = await getPosts(feedGraph.ids_user);

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
      }

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

/*

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
    //const posts = await getPosts(feedGraph.posts);

    // Reduce top 10 title objects from posts response

    for (let i = 0; i < posts.length; i++) {

      const postTop10 = posts[i].top_10;

      if (postTop10.length > 0) {
        for (let y = 0; y < postTop10.length; y++) {
          if (postTop10[y] !== null) postTop10[y] = titleObjectMini(postTop10[y], true);
        }
      }

    }

    // Build feed response object

    for (let i = 0; i < feedGraph.feed.length; i++) {

      let post_user_id;

      const post = posts.find(p => {
        const p_string = p._id.toString();
        post_user_id = p.userId;
        return p_string === feedGraph.feed[i].post;
      });

      if (post) {
        if (post_user_id.toString() === userId) feedGraph.feed[i].isOwnPost = true;
        const postResponseObject = postObject(post);
        feedGraph.feed[i].post = postResponseObject;
      }
      else {
        feedGraph.feed[i].post = null;
      }

    }

    return res.json({
      feed: feedGraph.feed
    });
  }
  catch (error) {
    return next(error);
  }

};

*/
