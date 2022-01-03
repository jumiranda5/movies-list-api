import config from "../config";

export function requireApiKey(req, res, next) {


  const key = config.API_KEY;
  const apiKey = req.headers['x-app-key'];

  if (key === apiKey) return next();
  else {
    const err = new Error('Invalid api key.');
    err.status = 401;
    return next(err);
  }

}
