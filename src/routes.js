import express from 'express';
const router = express.Router();

// router callback functions:
import { home } from './controllers/home_controller';
// Auth
import { access } from './controllers/auth/access_controller';
import { login } from './controllers/auth/login_controller';
import { signup } from './controllers/auth/signup_controller';
import { logout } from './controllers/auth/logout_controller';

// Middlewares
import { validateSignUp } from './middlewares/validation';
import { requireLogin } from './middlewares/requireLogin';


/* ------- HOME ------- */
router.get('/', home);

/* ------- AUTH ------- */
router.get('/api', access);
router.post('/api/login', login);
router.post('/api/signup', validateSignUp, signup);
router.post('/api/logout', requireLogin, logout);

module.exports = router;
