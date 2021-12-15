import express from 'express';
import bodyParser from 'body-parser';
const debug = require('debug')('app:');
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import config from './config';
import mongoose from 'mongoose';
import { connectMongo } from './database/mongoConfig';
import { closeGraph } from './database/graphConfig';
const admin = require("firebase-admin");
const path = require("path");


const corsConfig = {
  origin: [
    'https://euvi.herokuapp.com/'
  ],
  methods:['GET','POST'],
  credentials: false
};

// Firebase cloud messaging
admin.initializeApp({
  credential: admin.credential.cert(config.FIREBASE_CREDENTIALS)
});

// Instantiate the app
const app = express();

// database connection
connectMongo();

app.use(helmet());

app.use(cors(corsConfig));

app.use(morgan('dev'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

// Views
app.set('views', path.join(__dirname +  '/views'));
app.set('view engine', 'pug');

// include routes
const routes = require('./routes');
app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler => define as the last app.use callback
app.use((err, req, res, next) => {
  res.setHeader('Content-Type', 'application/json'); // Possible fix to doctype error...
  res.status(err.status || 500);
  res.json( { message: err.message });
});

// Invoke the app's '.listen()'
const port = config.PORT;
const server = app.listen(port, (err) => {
  if (err) {
    debug(err);
  } else {
    debug(`Server is listening on port ${port}`);
  }
});

// Disconnect dbs

const gracefulExit = async () => {

  await closeGraph();

  mongoose.connection.close(() => {
    debug("Mongoose default connection is disconnected due to application termination");
    server.close(() => {
      debug('Closed server.');
      process.exitCode = 1;
    });
  });
};

process.on('SIGINT', () => {
  debug("SIGINT");
  gracefulExit();
});

process.on('SITERM', () => {
  debug("SIGTERM");
  gracefulExit();
});

process.on('exit', () => {
  debug('Node exit.');
});

