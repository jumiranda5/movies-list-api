import express from 'express';
const router = express.Router();

// TODO!! => remove unused routes and controllers!

// dev message
import { send_message_to_dev } from './controllers/dev_message';

// router callback functions:
import { home } from './controllers/home_controller';
import { terms } from './controllers/terms_controller';
import { privacy } from './controllers/privacy_controller';
// Auth
import { access } from './controllers/auth/access_controller';
import { login } from './controllers/auth/login_controller';
import { signup } from './controllers/auth/signup_controller';
import { logout } from './controllers/auth/logout_controller';
import { delete_account } from './controllers/auth/delete_account';
import { save_fcm_token } from './controllers/auth/fcm_controller';

// User
import { search_user } from './controllers/user/search_user_controller';
import { profile } from './controllers/user/profile_controller';
import { edit_user } from './controllers/user/edit_user_controller';
import { profile_posts } from './controllers/user/profile_posts_controller';

// Follow
import { following } from './controllers/follow/following_controller';
import { followers } from './controllers/follow/followers_controller';
import { follow } from './controllers/follow/follow_controller';
import { unfollow } from './controllers/follow/unfollow_controller';

// Watchlist
import { watchlist } from './controllers/watchlist/watchlist';
import { add_watchlist_item } from './controllers/watchlist/watchlist_add_item';
import { delete_watchlist_item } from './controllers/watchlist/watchlist_delete_item';

// TMDB
import { search_tmdb_multi } from './controllers/tmdb/search_multi_controller';
import { search_tmdb_movie } from './controllers/tmdb/search_movie_controller';
import { search_tmdb_tv } from './controllers/tmdb/search_tv_controller';
import { tmdb_item } from './controllers/tmdb/tmdb_item_controller';
import { reactions_users } from './controllers/tmdb/reactions_controller';

// Post
//import { add_post } from './controllers/post/add_post_controller';
//import { create_post } from './controllers/post/create_post_controller';
//import { delete_post } from './controllers/post/delete_post_controller';
import { get_likes } from './controllers/post/get_likes_controller';
import { feed } from './controllers/post/feed_controller';
import { like } from './controllers/post/like_controller';
import { delete_like } from './controllers/post/delete_like_controller';
import { comments } from './controllers/post/comments';
import { create_comment } from './controllers/post/create_comment';
import { post } from './controllers/post/post_controller';
import { delete_comment } from './controllers/post/delete_comment';

// Reaction
import { create_reaction } from './controllers/reaction/create_reaction_controller';
import { get_trending } from './controllers/reaction/get_trending_controller';
import { delete_reaction } from './controllers/reaction/delete_reaction_controller';

// Top 10
import { top10 } from './controllers/top_10/top10_controller';

// Notifications
import { new_notifications_count } from './controllers/notifications/get_new_notifications_count';
import { get_notifications } from './controllers/notifications/get_notifications';
import { edit_notifications_prefs } from './controllers/notifications/edit_notifications_prefs';

// Test fcm
//import { send_notification } from './controllers/notification_controller';

// Middlewares
import { validateSignUp, validateSearchUser, validateSearch, validateEditUser } from './middlewares/validation';
import { requireLogin } from './middlewares/requireLogin';
import { requireApiKey } from './middlewares/requireApiKey';

import { test } from './controllers/test_controller';
router.get('api/test', test);

router.post('/api/dev-message', send_message_to_dev);

/* ------- HOME ------- */
router.get('/', home);
router.get('/terms-of-use/:lang', terms);
router.get('/privacy-policy/:lang', privacy);

/* ------- AUTH ------- */
router.get('/api', requireApiKey, access);
router.post('/api/login', requireApiKey, login);
router.post('/api/signup', [validateSignUp, requireApiKey], signup);
router.post('/api/logout', [requireLogin, requireApiKey], logout);
router.post('/api/delete-account', [requireLogin, requireApiKey], delete_account);
router.post('/api/save-fcm-token', requireApiKey, save_fcm_token);

/* ------- USER ------- */
router.get('/api/user/profile/:userId', [requireLogin, requireApiKey], profile);
router.get('/api/user/profile/:userId/:tab/:page', [requireLogin, requireApiKey], profile_posts);
router.post('/api/user/search/:page/:search', [requireLogin, requireApiKey, validateSearchUser], search_user);
router.post('/api/user/edit-user', [requireLogin, requireApiKey, validateEditUser], edit_user);

/* ------- FOLLOWS ------- */
router.get('/api/followers/:userId/:page', [requireLogin, requireApiKey], followers);
router.get('/api/following/:userId/:page', [requireLogin, requireApiKey], following);
router.post('/api/follow/:to/:senderUsername/:lang', [requireLogin, requireApiKey], follow);
router.post('/api/unfollow/:to', [requireLogin, requireApiKey], unfollow);

/* -------- WATCHLIST -------- */
router.get('/api/watchlist', [requireLogin, requireApiKey], watchlist);
router.post('/api/watchlist/add', [requireLogin, requireApiKey], add_watchlist_item);
router.post('/api/watchlist/delete/:type/:id', [requireLogin, requireApiKey], delete_watchlist_item);

/* -------- TMDB -------- */
router.get('/api/tmdb/search/multi/:query/:page/:lang', [requireLogin, requireApiKey, validateSearch], search_tmdb_multi);
router.get('/api/tmdb/search/tv/:query/:page/:lang', [requireLogin, requireApiKey, validateSearch], search_tmdb_tv);
router.get('/api/tmdb/search/movie/:query/:page/:lang', [requireLogin, requireApiKey, validateSearch], search_tmdb_movie);
router.get('/api/tmdb/item/:type/:itemId/:lang', [requireLogin, requireApiKey], tmdb_item);
router.get('/api/tmdb/reactions/:reactionsType/:tmdbId/:page', [requireLogin, requireApiKey], reactions_users);

/* -------- REACTIONS -------- */
router.get('/api/reaction/trending/:type/:lang', [requireLogin, requireApiKey], get_trending);
router.post('/api/post/add/:type', [requireLogin, requireApiKey], create_reaction);
router.post('/api/post/delete/:titleId', [requireLogin, requireApiKey], delete_reaction);

/* -------- POSTS -------- */
router.get('/api/post/feed/:page', [requireLogin, requireApiKey], feed);
router.get('/api/post/:postId', [requireLogin, requireApiKey], post);
//router.post('/api/post/add/:type', [requireLogin, requireApiKey], add_post);
//router.post('/api/post/delete/:postId', [requireLogin, requireApiKey], delete_post);

/* -------- LIKES -------- */
router.get('/api/post/likes/:id/:page/:type', [requireLogin, requireApiKey], get_likes);
router.post('/api/like/create/:targetId/:type/:targetUserId/:senderUsername/:postId/:lang', [requireLogin, requireApiKey], like);
router.post('/api/like/delete/:postId/:type', [requireLogin, requireApiKey], delete_like);

/* -------- COMMENTS -------- */
router.get('/api/comment/all/:postId/:page', [requireLogin, requireApiKey], comments);
router.post('/api/comment/create/:postId/:targetUserId/:responseTo/:senderUsername/:lang', [requireLogin, requireApiKey], create_comment);
router.post('/api/comment/delete/:commentId', [requireLogin, requireApiKey], delete_comment);

/* -------- Top 10 -------- */
router.get('/api/top10/:type', [requireLogin, requireApiKey], top10);


/* -------- Notifications -------- */
router.post('/api/notifications/prefs/:value', [requireLogin, requireApiKey], edit_notifications_prefs);
router.get('/api/notifications/count/:userId', [requireLogin, requireApiKey], new_notifications_count);
router.get('/api/notifications/:userId/:page', [requireLogin, requireApiKey], get_notifications);


module.exports = router;
