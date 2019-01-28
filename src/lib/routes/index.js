import { set as redisSet } from 'lib/redisSvc';

/**
 * Get something from the API. This is just an example route that has a side-effect of inserting
 * a key into redis.
 *
 * @param {string} name - A simple name to use as a redis key.
 * @returns {string} - A promise that resolves to the string value "something".
 */
export const getSomething = async (name) => {
  const fakeData = {
    foo: 'bar',
  };

  await redisSet(name, fakeData);
  return 'something';
};
