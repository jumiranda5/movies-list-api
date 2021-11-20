import { verifyAccessToken } from '../../helpers/token_helper';
import { getUserProfile, getUserPosts } from './_queries_user';
const debug = require('debug')('app:profile');

export const profile = async (req, res, next) => {

  // Profile main tab

  const userId = req.params.userId;
  const accessToken = req.headers['x-access-token'];
  let isOwnProfile;
  let isFollowing;

  // Get user (avatar, id, name, username), followers count,  following count, posts count from graph
  // Get posts from mongo (post type, media type, title[avatar, id, title], reaction)

  try {
    const dec = await verifyAccessToken(accessToken);
    const visitorId = dec.userId;

    const profile = await getUserProfile(userId, visitorId);

    if (userId === visitorId) isOwnProfile = true;
    else isOwnProfile = false;

    debug(`isOwnProfile = ${isOwnProfile}`);
    debug(profile);

    const posts = await getUserPosts(userId);
    debug(posts);

    return res.json({
      message: 'Success',
      user: profile.user,
      followersCount: profile.followersCount,
      followingCount: profile.followingCount,
      postsCount: profile.postsCount,
      isOwnProfile,
      isFollowing: false,
      posts
    });

  }
  catch(error) {
    return next(error);
  }


};
