import { get } from '../../config_axios';
import axios from 'axios';
import config from '../../config';
import tmdb from '../../config_tmdb';
import { searchResults } from '../../helpers/tmdb_helper';
import { verifyAccessToken } from '../../helpers/token_helper';
import { findWatchlist } from './_queries_tmdb';
import { isInputDataValid } from '../../middlewares/validation';
const debug = require('debug')('app:tmdb');

export const search_tmdb_movie = async (req, res, next) => {

  const api_key = config.TMDB_API_KEY;
  const query = req.params.query;
  const page = req.params.page;
  const lang = req.params.lang;

  // Validate search query
  const isDataValid = isInputDataValid(req);
  if (!isDataValid) {
    const err = new Error('Validation error.');
    err.status = 422;
    res.status(err.status || 500);
    return res.send({ message: err.message });
  }

  const searchRoute = `${tmdb.base_url}/search/movie`;
  const key = `api_key=${api_key}`;
  const language = `language=${lang}`;
  const q = `query=${query}`;

  const route = `${searchRoute}?${key}&${language}&page=${page}&include_adult=false&${q}`;

  try {

    const accessToken = req.headers['x-access-token'];
    const dec = await verifyAccessToken(accessToken);

    const response = await axios(get(route));

    const page = response.data.page;
    const total_pages = response.data.total_pages;
    const total_results = response.data.total_results;

    // Check if results are bookmarked
    const watchlist = await findWatchlist(dec.userId, 'movies');

    debug(watchlist);

    const savedSeries = [];
    let savedMovies = [];
    if (watchlist) savedMovies = watchlist.movies || [];

    debug(`Saved movies: ${savedMovies}`);

    const responseData = await searchResults(response.data.results, lang, savedMovies, savedSeries, "movie");

    let message;
    if (responseData.length === 0) message = 'No results';
    else message = `Search result: ${total_results} found. ${responseData.length} Passed. Page ${page} of ${total_pages}`;

    debug(responseData);

    let isLastPage = false;
    if (page === total_pages) isLastPage = true;

    return res.json({
      message: message,
      isLastPage: isLastPage,
      result: responseData
    });
  }
  catch(error) {
    debug(error);
    return next(error);
  }

};
