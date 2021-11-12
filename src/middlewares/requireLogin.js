import { verifyAccessToken } from "../helpers/token_helper";

export async function requireLogin(req, res, next) {

  try {
    const accessToken = req.headers['x-access-token'];
    await verifyAccessToken(accessToken);
    return next();
  }
  catch (error) {
    const err = new Error('User not logged in.');
    err.status = 401;
    return next(err);
  }

}
