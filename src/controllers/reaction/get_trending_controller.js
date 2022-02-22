import { getTrending } from "./_queries_reactions";
import { findWatchlist } from "../watchlist/_queries_watchlist";
import { get } from '../../config_axios';
import axios from 'axios';
import config from '../../config';
import tmdb from '../../config_tmdb';
import { trendingResults } from "../../helpers/tmdb_helper";
import { verifyAccessToken } from "../../helpers/token_helper";
const debug = require('debug')('app:trending');

export const get_trending = async (req, res, next) => {

  //const trendingList = await getTrending();
  //return res.json({ trending: trendingList });

  const api_key = config.TMDB_API_KEY;
  const media_type = req.params.type; // all || movie || tv
  const time_window = "day"; // day || week
  const lang = req.params.lang;

  const route = `${tmdb.base_url}/trending/${media_type}/${time_window}?api_key=${api_key}`;
  debug(route);

  try {
    const response = await axios(get(route));

    // Check if results are bookmarked
    const accessToken = req.headers['x-access-token'];
    const dec = await verifyAccessToken(accessToken);
    const userId = dec.userId;
    const watchlistDocument = await findWatchlist(userId);

    let savedMovies = [];
    let savedSeries = [];
    if (watchlistDocument) {
      savedMovies = watchlistDocument.movies || [];
      savedSeries = watchlistDocument.series || [];
    }

    const responseData = await trendingResults(response.data.results, savedMovies, savedSeries, lang);

    // Get results reactions

    const responseDataWithReactions = await getTrending(responseData);

    //debug(responseDataWithReactions);

    return res.json({
      message: 'Success',
      trending: responseDataWithReactions
    });
  }
  catch (error) {
    return next(error);
  }

};
