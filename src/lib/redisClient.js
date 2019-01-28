import cconfig from 'cconfig';
import redis from 'redis';

const {
  REDIS_HOST,
  REDIS_PORT,
} = cconfig();

/**
 * A simple wrapper to lazily instantiate a singleton redis client.
 */
const redisClient = {
  singleton: null,
  getInstance() {
    if (!this.singleton) {
      this.singleton = redis.createClient(REDIS_PORT, REDIS_HOST);
    }

    return this.singleton;
  },
};

export default redisClient;
