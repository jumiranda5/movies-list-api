import User from '../../database/models/user_model';
import { graphDb } from '../../database/graphConfig';
const debug = require('debug')('app:auth-queries');

/* ================================================================================================

                                    AUTH QUERIES - MONGO

================================================================================================= */

// CREATE

export const createUserDocument = async (userData) => {
  try {
    debug('Creating user document...');
    const newUser = await User.create(userData); // .create returns a promise so you shouldn't use .exec()
    debug('... done'); // +120ms
    return newUser;
  }
  catch (error) {
    if (error.code === 11000) {
      const err = new Error(`Username already in use.`);
      err.status = 409 ;
      debug(err.message);
      throw err;
    }
    else throw error;
  }
};

// READ

export const findUserSid = async (userId) => {

  try {
    const userObj = ['sid'];
    debug('Find user sid...');
    const user = await User.findById(userId, userObj).exec();
    debug('... done');

    if (user !== null) {
      debug(`User sid found: ${user.sid}`);
      return user.sid;
    }
    else {
      const err = new Error('Not found.');
      err.status = 404;
      err.message = 'User not found.';
      return null;
    }
  }
  catch(error) {
    debug(error.message);
    throw error;
  }

};

export const checkIfUserExists = async (googleId) => {

  try {

    const query = { google_id: googleId };
    const userObj = ['_id', 'username', 'name', 'avatar', 'isPrivate'];

    debug(`Checking if user exists...`);
    const user = await User.findOne(query, userObj).exec();
    debug(`...done`);

    return user;

  }
  catch(error) {
    debug(error.message);
    return false;
  }

};

// UPDATE

export const updateUserSid = async (userId, sid) => {

  const query = { _id: userId};
  const update = { $set: { sid }};

  try {
    debug(`Updating user sid...`);
    await User.findOneAndUpdate(query, update).exec();
    debug(`...done`);
  }
  catch (error) {
    debug(error);
    throw error;
  }

};

// DELETE

export const deleteUserDocument = async (userId) => {

  debug('Deleting user document...');
  const del = await User.deleteOne({_id: userId});
  debug('...done');

  const count = del.deletedCount;

  if (count === 0) {
    const error = new Error(`${userId} not found`);
    error.status = 404;
    throw error;
  }
  else {
    debug('User deleted on mongo.');
    return count;
  }
};

/* ================================================================================================

                                    AUTH QUERIES - GRAPH

================================================================================================= */

export const createUserNode = async (user, search) => {
  try {
    debug('Creating user node...');
    const graphRes = await graphDb.query(`
      CREATE (n:User{
        userId: '${user._id}',
        username: '${user.username}',
        name: '${user.name}',
        search: '${search}',
        avatar: '${user.avatar}'
      }) RETURN n`
    );
    debug('...done'); // +620ms
    debug(graphRes._results.length);
    if (graphRes._results.length > 0) return true;
    else return false;
  }
  catch (error) {
    debug(error);
    throw error;
  }

};

