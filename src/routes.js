import express from 'express';
const router = express.Router();

// router callback functions:
import { home } from './controllers/home_controller';
// Auth
import { access } from './controllers/auth/access_controller';
import { login } from './controllers/auth/login_controller';
import { signup } from './controllers/auth/signup_controller';
import { logout } from './controllers/auth/logout_controller';

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
import { add_post } from './controllers/post/add_post_controller';
import { delete_post } from './controllers/post/delete_post_controller';
import { get_likes } from './controllers/post/get_likes_controller';
import { feed } from './controllers/post/feed_controller';
import { like } from './controllers/post/like_controller';
import { delete_like } from './controllers/post/delete_like_controller';

// Top 10
import { top10 } from './controllers/top_10/top10_controller';

// Middlewares
import { validateSignUp, validateSearchUser, validateSearch } from './middlewares/validation';
import { requireLogin } from './middlewares/requireLogin';


/* ------- HOME ------- */
router.get('/', home);

/* ------- AUTH ------- */
router.get('/api', access);
router.post('/api/login', login);
router.post('/api/signup', validateSignUp, signup);
router.post('/api/logout', requireLogin, logout);

/* ------- USER ------- */
router.get('/api/user/profile/:userId', requireLogin, profile);
router.get('/api/user/profile/:userId/:tab', requireLogin, profile_posts);
router.post('/api/user/search/:page/:search', [requireLogin, validateSearchUser], search_user);
router.post('/api/user/edit-user', [requireLogin, validateSearchUser], edit_user);

/* ------- FOLLOWS ------- */
router.get('/api/followers/:userId/:page', requireLogin, followers);
router.get('/api/following/:userId/:page', requireLogin, following);
router.post('/api/follow/:to', requireLogin, follow);
router.post('/api/unfollow/:to', requireLogin, unfollow);

/* -------- WATCHLIST -------- */
router.get('/api/watchlist', requireLogin, watchlist);
router.post('/api/watchlist/add', requireLogin, add_watchlist_item);
router.post('/api/watchlist/delete/:type/:id', requireLogin, delete_watchlist_item);

/* -------- TMDB -------- */
router.get('/api/tmdb/search/multi/:query/:page/:lang', [requireLogin, validateSearch], search_tmdb_multi);
router.get('/api/tmdb/search/tv/:query/:page/:lang', [requireLogin, validateSearch], search_tmdb_tv);
router.get('/api/tmdb/search/movie/:query/:page/:lang', [requireLogin, validateSearch], search_tmdb_movie);
router.get('/api/tmdb/item/:type/:itemId/:lang', requireLogin, tmdb_item);
router.get('/api/tmdb/reactions/:reactionsType/:tmdbId/:page', requireLogin, reactions_users);

/* -------- POSTS -------- */
router.get('/api/post/feed/:page', requireLogin, feed);
router.get('/api/post/likes/:postId/:page', requireLogin, get_likes);
router.post('/api/post/add/:type', requireLogin, add_post);
router.post('/api/like/create/:postId/:type', like);
router.post('/api/like/delete/:postId/:type', delete_like);
router.post('/api/post/delete/:postId', requireLogin, delete_post);

/* -------- Top 10 -------- */
router.get('/api/top10/:type', requireLogin, top10);


module.exports = router;
