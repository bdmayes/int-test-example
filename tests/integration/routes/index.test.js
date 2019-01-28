import request from 'supertest';

import { app } from 'index';
import { get as redisGet } from 'lib/redisSvc';

describe('int-test-example routes', () => {
  describe('default route', () => {
    it('should work', async () => {
      const result = await request(app).get('/');
      expect(result.status).toBe(200);
      expect(result.text).toEqual('OK');
    });
  });

  describe('getSomething()', async () => {
    it('should return correctly and insert into redis', async () => {
      const fakeData = {
        foo: 'bar',
      };

      const result = await request(app).get('/something?name=fakeRedisKey');
      expect(result.status).toBe(200);
      expect(JSON.parse(result.text)).toEqual(fakeData);

      // verify the side-effect that this route will insert the key into redis
      const redisResult = await redisGet('fakeRedisKey');
      expect(redisResult).toEqual(fakeData);
    });
  });
});
