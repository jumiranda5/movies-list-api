import { findTop10 } from "../top_10/_queries_top10";
const debug = require('debug')('app:profile-posts');

export const profile_posts = async (req, res, next) => {

  // Profile tabs
  const tab = req.params.tab; //(tv || movie)
  const userId = req.params.userId;

  // Get Top 10 list (movies || series)
  // Get posts (movies || series) => todo... getting this data on profile main tab for now...

  try {
    const top10Document = await findTop10(userId, tab);

    if (top10Document) {

      debug(top10Document);

      return res.json({
        message: 'Top 10 document found',
        series: top10Document.series,
        movies: top10Document.movies
      });
    }
    else {
      return res.json({
        message: 'Top 10 document not found'
      });
    }

  }
  catch (error) {
    return next(error);
  }

};
