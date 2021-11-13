import { graphDb } from '../../database/graphConfig';
const debug = require('debug')('app:auth-queries');

/* ================================================================================================

                                             FOLLOW

================================================================================================= */

export const createFollow = async (from, to) => {
  try {
    await graphDb.query(`
      MATCH (from:User), (to:User)
      WHERE from.userId = '${from}' AND to.userId = '${to}'
      MERGE (from)-[r:FOLLOWS]->(to)
      SET r.createdAt ='${Date.now()}'`
    );
  }
  catch (error) {
    debug(error);
    throw error;
  }
};

export const deleteFollow = async (from, to) => {
  try {
    await graphDb.query(`
      MATCH (from:User{userId:'${from}'})-[r:FOLLOWS]->(to:User{userId:'${to}'})
      DELETE r`
    );
  }
  catch (error) {
    debug(error);
    throw error;
  }
};
