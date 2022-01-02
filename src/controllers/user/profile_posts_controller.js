import { findTop10 } from "../top_10/_queries_top10";
import { getUserPosts } from './_queries_user';
const debug = require('debug')('app:profile-posts');

export const profile_posts = async (req, res, next) => {

  // Profile tabs
  const tab = req.params.tab; //(tv || movie || multi)
  const userId = req.params.userId;
  const page = req.params.page;

  debug(`User id => ${userId}`);

  // Get Top 10 list (movies || series)
  // Get posts from mongo (post type, media type, title[avatar, id, title], reaction)


  try {

    debug("Get posts from mongo...");
    debug(`Get posts from mongo... PAGE:  ${page}`);

    const posts = await getUserPosts(userId, tab, page);

    return res.json({
      message: 'Success',
      posts: posts
    });

    /*

    Implement top 10 later... only check if document exist and if list size is bigger than 0 to show button on client

    if (page === "1" || page === 1) {
      debug("get top 10 document...");
      //const top10Document = await findTop10(userId, tab);

      if (top10Document) {

        return res.json({
          message: 'Top 10 document found',
          series: top10Document.series,
          movies: top10Document.movies,
          posts: posts
        });
      }
      else {
        return res.json({
          message: 'Top 10 document not found',
          posts: posts
        });
      }

    }
    else {
      return res.json({
        message: 'Not page 1',
        posts: posts
      });
    }
    */

  }
  catch (error) {
    return next(error);
  }

};
