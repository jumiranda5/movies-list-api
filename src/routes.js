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

// Follow
import { follow } from './controllers/follow/follow_controller';
import { unfollow } from './controllers/follow/unfollow_controller';

// Watchlist
import { add_watchlist_item } from './controllers/watchlist/watchlist_add_item';
import { delete_watchlist_item } from './controllers/watchlist/watchlist_delete_item';

// TMDB
import { search_tmdb_multi } from './controllers/tmdb/search_multi_controller';

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
router.post('/api/user/search/:page/:search', [requireLogin, validateSearchUser], search_user);

/* ------- FOLLOWS ------- */
router.post('/api/follow/:to', requireLogin, follow);
router.post('/api/unfollow/:to', requireLogin, unfollow);

/* -------- WATCHLIST -------- */
router.post('/api/watchlist/add', requireLogin, add_watchlist_item);
router.post('/api/watchlist/delete/:type/:id', requireLogin, delete_watchlist_item);

/* -------- TMDB -------- */
router.get('/api/tmdb/search/multi/:query/:page/:lang', [requireLogin, validateSearch], search_tmdb_multi);
//router.get('/api/tmdb/search/multi/:query/:page/:lang', search_tmdb_multi);

module.exports = router;
