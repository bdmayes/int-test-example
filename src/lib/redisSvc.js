import cconfig from 'cconfig';
import log from 'llog';

import redisClient from './redisClient';

const { REDIS_DEFAULT_TTL_SECONDS } = cconfig();

/**
 * Retrieve a value from redis.
 *
 * @param {string} key - The key whose value we wish to retrieve.
 * @returns {Promise} - The value for the given key, run though JSON.parse().
 */
export const get = key => new Promise((resolve, reject) => {
  log.info(`data requested for key:${key}`);

  redisClient.getInstance().get(`key:${key}`, (err, reply) => {
    if (err) {
      reject(err);
    }

    try {
      const json = JSON.parse(reply);
      log.info({
        msg: `got request ${key} data`,
        json,
      });

      resolve(json);
    } catch (parseErr) {
      reject(parseErr);
    }
  });
});

/**
 * Set (or insert) a value in redis.
 *
 * @param {string} key - The key whose value we wish to insert.
 * @param {*} data - The data we wish to insert.
 * @param {number} [ttl=60] - The time to live value, until redis expires this key.
 * @returns {Promise} - The given key if the insert is successful.
 */
export const set = (key, data, ttl = REDIS_DEFAULT_TTL_SECONDS) => {
  log.info({
    msg: `setting request ${key}`,
    data,
  });

  return new Promise((resolve, reject) => {
    try {
      redisClient.getInstance().setex(`key:${key}`, ttl, JSON.stringify(data));
      resolve(key);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Unset (or delete) a value from redis.
 *
 * @param {string} key - The key whose value we wish to delete.
 * @returns {Promise} - The given key if the delete is successful.
 */
export const unset = (key) => {
  log.info({
    msg: `unsetting request ${key}`,
  });

  return new Promise((resolve, reject) => {
    try {
      redisClient.getInstance().del(`key:${key}`);
      resolve(key);
    } catch (err) {
      reject(err);
    }
  });
};
