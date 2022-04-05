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
import { feed } from './controllers/post/feed_controller';
import { post } from './controllers/post/post_controller';

// Reaction
import { create_reaction } from './controllers/reaction/create_reaction_controller';
import { get_trending } from './controllers/reaction/get_trending_controller';
import { delete_reaction } from './controllers/reaction/delete_reaction_controller';

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

/* -------- Notifications -------- */
router.post('/api/notifications/prefs/:value', [requireLogin, requireApiKey], edit_notifications_prefs);
router.get('/api/notifications/count/:userId', [requireLogin, requireApiKey], new_notifications_count);
router.get('/api/notifications/:userId/:page', [requireLogin, requireApiKey], get_notifications);


module.exports = router;
