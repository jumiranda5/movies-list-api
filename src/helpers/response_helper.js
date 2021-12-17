const debug = require('debug')('app:helper');

export const graphUserObject = (user) => {
  return {
    userId: user.userId,
    username: user.username,
    name: user.name,
    avatar: user.avatar
  };
};

export const titleObjectMini = (title) => {
  return {
    tmdb_id: title.tmdb_id,
    title: title.title,
    poster: title.poster,
    type: title.type
  };
};

export const postObject = (post) => {

  const title = post.title;
  let titleObject;

  if (title) titleObject = {
    tmdb_id: title._id,
    title: title.title,
    release_year: title.release_year,
    genre: title.genre,
    poster: title.poster
  };
  else titleObject = post.title;

  return {
    postId: post._id,
    userId: post.userId,
    comment: post.comment,
    postType: post.post_type,
    mediaType: post.media_type,
    top10: post.top_10,
    reaction: post.reaction,
    title: titleObject
  };
};

/*

Removed for now...

export const graphRecommendations = (recs, userId) => {

  const recommendations = [];

  for (let i = 0; i < recs.length; i++) {
    const titleId = recs[i][0];
    const title = recs[i][1];
    const count = recs[i][2];
    const users = recs[i][3];
    const poster = recs[i][4];

    const avatars = [];
    let recommended = false;

    for (let y = 0; y < users.length; y++) {
      const recUserId = users[y][0];
      const avatar = users[y][1];
      avatars.push(avatar);
      if (recUserId === userId) recommended = true;
    }

    const recommendation = {
      titleId,
      title,
      poster,
      count,
      users: avatars,
      recommended
    };

    debug(recommendation.count);

    if (titleId) recommendations.push(recommendation);
  }

  return recommendations;

};
*/
