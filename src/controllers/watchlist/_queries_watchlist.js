import Watchlist from '../../database/models/watchlist_model';
//const debug = require('debug')('app:mongo');

/* ================================================================================================

                                         WATCHLIST

================================================================================================= */

export const updateWatchlistAddItem = async (userId, mediaType, mediaObj) => {

  const query = { userId: userId };
  const updateMovies = { $addToSet: { movies: mediaObj }};
  const updateSeries = { $addToSet: { series: mediaObj }};
  const options = { upsert: true };

  let update = {};
  if (mediaType === 'movie') update = updateMovies;
  if (mediaType === 'tv') update = updateSeries;

  //debug(`Inserting item to ${mediaType}...`);
  const updateDoc = await Watchlist.updateOne(query, update, options).exec();
  //debug('... done'); // +126ms

  const upserted = updateDoc.upsertedCount;
  const modified = updateDoc.modifiedCount;
  //debug(updateDoc);

  if (upserted === 1 || modified === 1) {
    //debug(`Completed insertion.`);
    return true;
  }
  else {
    //debug(`Insertion failed.`);
    const err = new Error(`Server error.`);
    err.status = 500;
    //debug(err.message);
    throw err;
  }

};

export const updateWatchlistDeleteItem = async (userId, mediaType, tmdb_id) => {

  const query = { userId: userId };
  const updateMovies = { $pull: { movies: {_id: tmdb_id} }};
  const updateSeries = { $pull: { series: {_id: tmdb_id} }};
  const options = {};

  let update = {};
  if (mediaType === 'movie') update = updateMovies;
  if (mediaType === 'tv') update = updateSeries;

  //debug(`Deleting item from ${mediaType}...`);
  const updateDoc = await Watchlist.updateOne(query, update, options).exec();
  //debug('... done'); // +128ms

  const upserted = updateDoc.upsertedCount;
  const modified = updateDoc.modifiedCount;
  //debug(updateDoc);

  if (upserted === 1 || modified === 1) {
    //debug(`Completed removal.`);
    return true;
  }
  else {
    //debug(`Insertion failed.`);
    const err = new Error(`Server error.`);
    err.status = 500;
    //debug(err.message);
    throw err;
  }

};

export const findWatchlist = async (userId) => {

  //debug('Find watchlist...');
  const watchlist = await Watchlist.findOne({userId: userId}).exec();
  //debug('... done');

  if (watchlist !== null) {
    //debug(`watchlist found: ${watchlist._id}`);
    return watchlist;
  }
  else {
    //debug('Whatchlist document not found');
    return null;
  }

};
