import { get } from '../../config_axios';
import axios from 'axios';
import config from '../../config';
import tmdb from '../../config_tmdb';
import { searchResults } from '../../helpers/tmdb_helper';
import { findWatchlist } from '../watchlist/_queries_watchlist';
import { verifyAccessToken } from '../../helpers/token_helper';
import { isInputDataValid } from '../../middlewares/validation';
const debug = require('debug')('app:tmdb');

export const search_tmdb_multi = async (req, res, next) => {

  const api_key = config.TMDB_API_KEY;
  const query = req.params.query;
  const page = req.params.page;
  const lang = req.params.lang;

  debug(`QUERY=> ${query}`);

  // Validate search query
  const isDataValid = isInputDataValid(req);
  if (!isDataValid) {
    const err = new Error('Validation error.');
    err.status = 422;
    res.status(err.status || 500);
    return res.send({ message: err.message });
  }

  const searchRoute = `${tmdb.base_url}/search/multi`;
  const key = `api_key=${api_key}`;
  const language = `language=${lang}`;
  const q = `query=${query}`;

  const route = `${searchRoute}?${key}&${language}&page=${page}&include_adult=false&${q}`;

  try {
    const response = await axios(get(route));

    const page = response.data.page;
    const total_pages = response.data.total_pages;
    const total_results = response.data.total_results;

    // Check if results are bookmarked
    const accessToken = req.headers['x-access-token'];
    const dec = await verifyAccessToken(accessToken);
    const watchlistDocument = await findWatchlist(dec.userId);

    let savedMovies = [];
    let savedSeries = [];
    if (watchlistDocument) {
      savedMovies = watchlistDocument.movies || [];
      savedSeries = watchlistDocument.series || [];
    }

    const responseData = await searchResults(response.data.results, lang, savedMovies, savedSeries, null);

    let message;
    if (responseData.length === 0) message = 'No results';
    else message = `Search result: ${total_results} found. ${responseData.length} Passed. Page ${page} of ${total_pages}`;

    debug(responseData);

    return res.json({
      message: message,
      result: responseData
    });
  }
  catch(error) {
    debug(error);
    return next(error);
  }

};

