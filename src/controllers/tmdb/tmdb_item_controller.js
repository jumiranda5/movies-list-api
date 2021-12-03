import { get } from '../../config_axios';
import axios from 'axios';
import config from '../../config';
import tmdb from '../../config_tmdb';
import { verifyAccessToken } from '../../helpers/token_helper';
import { getProviders, getMainTrailer, getMediaObject } from '../../helpers/tmdb_helper';
import { getAllReactions, getFollowingReactions, findWatchlist } from './_queries_tmdb';
const debug = require('debug')('app:tmdb');

export const tmdb_item = async (req, res, next) => {

  const api_key = config.TMDB_API_KEY;

  // PARAMS
  const type = req.params.type; // tv || movie
  const itemId = req.params.itemId;
  const lang = req.params.lang;
  const langParts = lang.split("-");
  const countryCode = langParts[1];


  debug(`Type: ${type}`);
  debug(`Language: ${lang}`);

  // ROUTE
  const tmdbRoute = `${tmdb.base_url}/${type}`;
  const key = `api_key=${api_key}`;
  const language = `language=${lang}`;
  const append_video = `&append_to_response=videos,release_dates&include_video_language=${lang}`; // release_dates are only for movie rating
  const route = `${tmdbRoute}/${itemId}?${key}&${language}&${append_video}`;

  // JUSTWATCH
  const justwatch_route = `${tmdbRoute}/${itemId}/watch/providers?${key}`;

  try {

    const accessToken = req.headers['x-access-token'];
    const dec = await verifyAccessToken(accessToken);
    const userId = dec.userId;
    //const userId = '616b003821f6b937d9e4473e';

    debug('get data');
    const itemData = await Promise.all([
      axios(get(route)),
      axios(get(justwatch_route)),
      getAllReactions(itemId),
      getFollowingReactions(itemId, userId),
      findWatchlist(userId, type)
    ]);
    debug('...done'); // +409ms

    const response = itemData[0];
    const justwatch_response = itemData[1];
    const app_reactions = itemData[2];
    const following_reactions = itemData[3];
    const watchlist = itemData[4];

    debug('build tmdb object...');
    const responseObjects = await Promise.all([
      getMediaObject(response.data, lang, type),
      getProviders(justwatch_response.data, countryCode),
      getMainTrailer(response.data.videos.results)
    ]);
    debug('...done'); // +2ms

    const data = responseObjects[0];
    const providers = responseObjects[1];
    const trailers = responseObjects[2];

    let trailerResponse;
    debug(trailers.length);
    if (trailers.length === 0) trailerResponse = {};
    else trailerResponse = trailers[0];

    let message;
    let content_rating = '';

    debug('get certification data...');
    if (type === 'movie') {
      message = `Found movie: ${data.title}`;
      // Movie rating
      const certifications = response.data.release_dates.results;
      const localCertification = certifications.find(item => item.iso_3166_1 === countryCode);
      if (localCertification) content_rating = localCertification.release_dates[0].certification;
    }
    else {
      message = `Found tv show: ${data.title}`;
      //  TV Rating
      const tv_content_rating_route = `${tmdbRoute}/${itemId}/content_ratings?${key}&${language}`;
      const ratingResponse = await axios(get(tv_content_rating_route));
      const localCertification = ratingResponse.data.results.find(item => item.iso_3166_1 === countryCode);
      if (localCertification) content_rating = localCertification.rating;
    }
    debug('...done'); // +233ms

    // Check if results are bookmarked
    let isBookmarked = false;
    if (type === 'movie' && watchlist.movies.find(doc => doc._id === itemId)) isBookmarked = true;
    if (type === 'tv' && watchlist.series.find(doc => doc._id === itemId)) isBookmarked = true;
    debug(`Is bookmarked: ${isBookmarked}`);

    // Reactions - following
    const following_reactions_array = following_reactions.reactions;
    const following_reactions_total = following_reactions.total;

    // Reactions - App
    const app_reactions_array = app_reactions.reactions;
    const app_reactions_total = app_reactions.total;

    return res.json({
      message: message,
      appReactions: app_reactions_array,
      appReactionsTotal: app_reactions_total,
      followingReactions: following_reactions_array,
      followingReactionsTotal: following_reactions_total,
      tmdbResponse: data,
      trailer: trailerResponse,
      providers: providers,
      contentRating: content_rating,
      isBookmarked: isBookmarked
    });

  }
  catch (error) {
    debug(error);
    return next(error);
  }

};
