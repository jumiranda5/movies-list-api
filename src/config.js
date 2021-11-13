import dotenv from 'dotenv';
dotenv.config();

/*eslint no-process-env: 0*/
const environment = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;
let ENV;

if (environment === "development") {
  ENV = process.env.ENVIRONMENT_DEV;
}
else {
  ENV = process.env.ENVIRONMENT_PROD;
}

const config = {

  PORT,
  ENV,
  DB : {
    mongo_uri: process.env.MONGODB_URI,
    db_user: process.env.DB_USER,
    db_pass: process.env.DB_PASS,
    db_name: process.env.DB_NAME,
    redis_pass: process.env.REDIS_PASS,
    redis_endpoint: process.env.REDIS_ENDPOINT,
    redis_port: process.env.REDIS_PORT
  },
  TMDB_API_KEY: process.env.TMDB_API_KEY,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  CLIENT_ID: process.env.CLIENT_ID
};

export default config;
