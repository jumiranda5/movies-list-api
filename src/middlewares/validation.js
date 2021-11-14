import { body, param, validationResult } from 'express-validator';
const debug = require('debug')('app:validator');

/* ================================================
                VALIDATION FUNCTION
 ================================================== */

 export const isInputDataValid = (req) => {

  const validationErrors = validationResult(req);

  if (validationErrors.isEmpty()) {
    debug('Validation passed!');
    return true;
  }
  else {
    debug(validationErrors.array());
    return false;
  }

};

/*eslint dot-location: 0*/

export const validateSignUp = [
  body('username')
    .isLength({min: 3, max:30})
    .withMessage('Should be from 3 to 30 characters')
    .matches(/^[a-zA-Z0-9._-]{1,30}$/u)
    .withMessage('Invalid username')
    .trim()
    .escape(),
  body('name')
    .isLength({min: 2, max: 50})
    .withMessage('Should be from 2 to 50 characters.')
    .matches(/^[^"/%$@#.,+=<>:;?!*\\{}[\]()]{1,50}$/u)
    .withMessage('Invalid name')
    .trim(),
  body('avatarUrl')
    .optional(true)
    .isURL()
    .withMessage('Invalid url'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email.'),
];

export const validateSearchUser = [
  param('search')
    .matches(/^[^"/%$#,+=<>:;?!*\\{}[\]()]{1,100}$/u)
    .withMessage('Invalid name')
    .trim()
];

export const validateSearch = [
  param('query')
    .matches(/^[^"<>\\{}[\]]{1,200}$/u)
    .withMessage('Invalid search')
    .trim()
];


