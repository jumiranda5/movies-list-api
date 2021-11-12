import config from '../config';
const debug = require('debug')('app:redis');
const RedisGraph = require("redisgraph.js").Graph;

const {
  DB : { redis_pass, redis_port, redis_endpoint }
} = config;

const graph = new RedisGraph("euvi", redis_endpoint, redis_port, {password: redis_pass});
//graph.deleteGraph();
//graph.query("CALL db.idx.fulltext.createNodeIndex('User','search')");

/*
export const connectRedis = async () => {
  try {

    const client = await graph._client;

    if (client !== null || client !== undefined) {
      debug('Redis graph client is ready.');

    }

  }
  catch(error) {
    debug(error);
  }

};
*/

export const closeGraph = () => {
  return new Promise((resolve, reject) => {
    try{
      debug('Closing redis graph...');
      graph.close();
      debug('Redis graph closed.');
      resolve();
    }
    catch(error) {
      reject(error);
    }
  });
};

export const graphDb = graph;
