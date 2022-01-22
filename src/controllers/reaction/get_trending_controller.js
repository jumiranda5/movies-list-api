import { getTrending } from "./_queries_reactions";
import { findWatchlist } from "../watchlist/_queries_watchlist";
import { get } from '../../config_axios';
import axios from 'axios';
import config from '../../config';
import tmdb from '../../config_tmdb';
import { trendingResults } from "../../helpers/tmdb_helper";
const debug = require('debug')('app:trending');

export const get_trending = async (req, res, next) => {

  //const trendingList = await getTrending();
  //return res.json({ trending: trendingList });

  const api_key = config.TMDB_API_KEY;
  const media_type = "all"; // all || movie || tv
  const time_window = "day"; // day || week

  const route = `${tmdb.base_url}/trending/${media_type}/${time_window}?api_key=${api_key}`;
  debug(route);

  try {
    const response = await axios(get(route));

    // Check if results are bookmarked
//    const accessToken = req.headers['x-access-token'];
//    const dec = await verifyAccessToken(accessToken);
    const userId = "61d4c69329072ca3b7d74183";
    const watchlistDocument = await findWatchlist(userId);

    let savedMovies = [];
    let savedSeries = [];
    if (watchlistDocument) {
      savedMovies = watchlistDocument.movies || [];
      savedSeries = watchlistDocument.series || [];
    }

    const responseData = await trendingResults(response.data.results, savedMovies, savedSeries);

    // Get results reactions

    const responseDataWithReactions = await getTrending(responseData);

    return res.json({
      response: responseDataWithReactions
    })
  }
  catch (error) {
    return next(error);
  }

};
