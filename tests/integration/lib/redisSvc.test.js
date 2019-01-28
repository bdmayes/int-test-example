import { get, set, unset } from 'lib/redisSvc';
import RedisClient from 'lib/redisClient';

describe('RedisSvc', () => {
  const data = {
    hello: 'world',
  };
  const initialKey = 'key';
  const initialKey2 = 'key2';

  beforeAll(async () => {
    // Cache a couple of values for the data repo.
    await set(initialKey, data);
    await set(initialKey2, data);
  });

  afterAll(async () => {
    // Don't leave this connection hanging open.
    RedisClient.getInstance().quit();
  });

  describe('get()', () => {
    it('should return data for a key that exists', async () => {
      const result = await get(initialKey);
      expect(result).toEqual(data);
    });

    it('should return nothing for a key that does not exist', async () => {
      const result = await get('keyThatDoesNotExist');
      expect(result).toBeNull();
    });
  });

  describe('set()', () => {
    it('should be capable of inserting a new key', async () => {
      const fakeData = {
        bar: 'baz',
      };
      const key = 'foo';

      await set(key, fakeData);

      const checkResult = await get(key);
      expect(checkResult).toEqual(fakeData);
    });
  });

  describe('unset()', () => {
    it('should be capable of removing a key', async () => {
      await unset(initialKey2);

      const checkResult = await get(initialKey2);
      expect(checkResult).toBeNull();
    });
  });
});
