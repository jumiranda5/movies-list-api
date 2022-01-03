import tmdb from '../config_tmdb';
const debug = require('debug')('app:tmdb_helper');

/* ======= REPLACE LATIN CHARACTERS ======== */

export const replaceCharacters = (string) => {

  let newString;

  newString = string.replace(/ç/gu, "c");
  newString = string.replace(/[àáâãäå]/gu, "a")
  newString = string.replace(/[èéêë]/gu, "e");
  newString = string.replace(/[ìíîï]/gu, "i");
  newString = string.replace(/[òóôõö]/gu, "o");
  newString = string.replace(/[ùúûü]/gu, "u");
  newString = string.replace(/ñ/gu, "n");
  newString = string.replace(/œ/gu, "oe");
  newString = string.replace(/æ/gu, "ae");

  return newString;

};

/* ========== SEARCH ITEM OBJECT ========== */

export const searchResults = (responseData, lang, savedMovies, savedSeries, type) => {

  const image_base_url = tmdb.images.secure_base_url;
  const poster_size = tmdb.images.poster_sizes[1];

  const langParts = lang.split("-");
  const lang1 = langParts[0];

  return new Promise((resolve, reject) => {

    try{

      const responseArray = [];

      for (let i = 0; i < responseData.length; i++) {

        // GENRES
        const genre_ids = responseData[i].genre_ids || [];
        const genres = [];
        for (let y = 0; y < genre_ids.length; y++) {
          const genreId = genre_ids[y];
          const genre = tmdb.genres.find(genre => genre.id === genreId);
          if (genre) {
            if (lang1 === 'pt') genres.push(genre.name_pt);
            else genres.push(genre.name);
          }
        }

        // VALIDATION
        const isBlocked = tmdb.blocked.includes(responseData[i].id);
        const isPosterNull = responseData[i].poster_path === null;
        const isOverviewNull = responseData[i].overview === '';
        const validationArray = [isPosterNull, isOverviewNull];
        const validate = array => array.every(v => v === true);
        const isResultEmpty = validate(validationArray); // if both the poster and overview are null
        //debug(`isResultEmpty: ${isResultEmpty}`);

        // RELEASE YEAR
        const release_date = responseData[i].release_date || responseData[i].first_air_date;
        let year = '';
        if (release_date) {
          const dateParts = release_date.split("-");
          year = dateParts[0];
        }

        // IS SAVED ON WATCHLIST
        const media_type = responseData[i].media_type || type;
        let isBookmarked = false;
        if (media_type === 'movie' && savedMovies.find(doc => doc._id === responseData[i].id.toString())) isBookmarked = true;
        if (media_type === 'tv' && savedSeries.find(doc => doc._id === responseData[i].id.toString())) isBookmarked = true;

        // DATA OBJECT
        if (media_type !== "person" && !isResultEmpty && !isBlocked) {
          const data = {
            title: responseData[i].title || responseData[i].name,
            tmdb_id: responseData[i].id,
            type: media_type,
            overview: responseData[i].overview,
            release_year: year,
            poster: `${image_base_url}${poster_size}${responseData[i].poster_path}`,
            popularity: responseData[i].popularity,
            adult: responseData[i].adult,
            genre: genres[0],
            isBookmarked: isBookmarked
          };

          responseArray.push(data);

        }

      }

      responseArray.sort((a,b) => { return a.popularity - b.popularity; });
      responseArray.reverse();

      resolve(responseArray);
    }
    catch(error) {
      reject(error);
    }

  });

};

/* ========== MOVIE/TV OBJECT ========== */

export const getMediaObject = (data, lang, type) => {

  //debug(data);

  const site_url = tmdb.site_url;
  const image_base_url = tmdb.images.secure_base_url;
  const logo_size = tmdb.images.logo_sizes[1];
  const poster_size = tmdb.images.poster_sizes[4];

  // GENRES
  const genresObjArray = data.genres;
  const genres = [];
  for (let i = 0; i < genresObjArray.length; i++) {
    genres.push(genresObjArray[i].name);
  }

  // LINK
  const original_title = data.original_name || data.original_title;
  const link0 = original_title.trim().toLowerCase();
  const link1 = link0.replaceAll("'", "-");
  const link2 = link1.replaceAll(":", "");
  const link_original_name = link2.replaceAll(" ", "-");

  // CREATED BY
  const creatorsObjArray = data.created_by || [];
  const creators = [];
  for (let i = 0; i < creatorsObjArray.length; i++) {
    creators.push(creatorsObjArray[i].name);
  }

  // NETWORKS - removed for now...
  //const networks = data.networks || [];
  //for (let i = 0; i < networks.length; i++) {
  //  const logo_path = networks[i].logo_path;
  //  networks[i].logo_path = `${image_base_url}${logo_size}${logo_path}`;
  //}

  return new Promise((resolve, reject) => {
    try {

      const release_date = data.release_date || data.first_air_date;
      let year = '';
      if (release_date) {
        const dateParts = release_date.split("-");
        year = dateParts[0];
      }

      const obj = {
        id: data.id,
        genres: genres,
        homepage: data.homepage || null,
        status: data.status,
        title: data.title || data.name,
        original_title: original_title,
        tagline: data.tagline,
        overview: data.overview,
        poster: `${image_base_url}${poster_size}${data.poster_path}`,
        release_year: year,
        tmdb_link: `${site_url}/${type}/${data.id}-${link_original_name}?language=${lang}`,
        created_by: creators || [],
        number_of_seasons: data.number_of_seasons || 0
      };

      resolve(obj);
    }
    catch(error) {
      reject(error);
    }

  });

};

/* ========== PROVIDERS LIST ========== */

export const getProviders = (data, countryCode) => {

  //debug('Building providers list...');

  const base_url = tmdb.images.secure_base_url;
  const logo_size = tmdb.images.logo_sizes[1];

  const providersResults = data.results;
  let localProviders = providersResults[countryCode];
  if (!localProviders) localProviders = [];

  const flatrate = localProviders.flatrate || [];
  const rent = localProviders.rent || [];
  const buy = localProviders.buy || [];
  const ads = localProviders.ads || [];
  const free = localProviders.free || [];

  return new Promise((resolve, reject) => {
    try{

      const providers = [];

      for (let i = 0; i < flatrate.length; i++) {
        const logo_path = flatrate[i].logo_path;
        flatrate[i].logo_path = `${base_url}${logo_size}${logo_path}`;
        providers.push(flatrate[i]);
      }

      for (let i = 0; i < rent.length; i++) {
        const logo_path = rent[i].logo_path;
        rent[i].logo_path = `${base_url}${logo_size}${logo_path}`;
        if (!providers.find(provider => provider.provider_name === rent[i].provider_name)) providers.push(rent[i]);
      }

      for (let i = 0; i < buy.length; i++) {
        const logo_path = buy[i].logo_path;
        buy[i].logo_path = `${base_url}${logo_size}${logo_path}`;
        if (!providers.find(provider => provider.provider_name === buy[i].provider_name)) providers.push(buy[i]);
      }

      for (let i = 0; i < ads.length; i++) {
        const logo_path = ads[i].logo_path;
        ads[i].logo_path = `${base_url}${logo_size}${logo_path}`;
        if (!providers.find(provider => provider.provider_name === ads[i].provider_name)) providers.push(ads[i]);
      }

      for (let i = 0; i < free.length; i++) {
        const logo_path = free[i].logo_path;
        free[i].logo_path = `${base_url}${logo_size}${logo_path}`;
        if (!providers.find(provider => provider.provider_name === free[i].provider_name)) providers.push(free[i]);
      }

      providers.sort((a,b) => { return a.display_priority - b.display_priority; });

      resolve(providers);

    }
    catch(error) {
      reject(error);
    }

  });

};

/* ========== MAIN TRAILER ========== */

export const getMainTrailer = (trailerObjArray) => {

  //debug('Getting main trailer...');

  if (trailerObjArray.length === 0) return [];
  else {
    return new Promise((resolve, reject) => {
      try{
        const trailers = [];
        const scoreTrailer = 3;
        const scoreOfficial = 3;
        const scoreMain = 1;
        const scoreTrailerInTitle = 1;


        for (let i = 0; i < trailerObjArray.length; i++) {

          if (trailerObjArray[i].site === 'YouTube') {

            const trailerTitle = trailerObjArray[i].name.toLowerCase();

            let score = 0;

            if (trailerObjArray[i].type === 'Trailer') score = score + scoreTrailer;
            if (trailerObjArray[i].official === true) score = score + scoreOfficial;
            if (trailerTitle.includes('main') ||
                trailerTitle.includes('principal') ||
                trailerTitle.includes('trailer #1') ||
                trailerTitle.includes('trailer 1')) score = score + scoreMain;
            if (trailerTitle.includes('trailer')) score = score + scoreTrailerInTitle;

            const trailer = {
              name: trailerObjArray[i].name,
              key: trailerObjArray[i].key,
              site: trailerObjArray[i].site,
              type: trailerObjArray[i].type,
              official: trailerObjArray[i].official,
              priority: score,
              url: `https://www.youtube.com/watch?v=${trailerObjArray[i].key}`
            };
            trailers.push(trailer);
          }

        }

        trailers.sort((a,b) => { return a.priority - b.priority; });
        trailers.reverse();

        //debug(trailers);

        resolve(trailers);
      }
      catch(error) {
        reject(error);
      }

    });
  }

};
