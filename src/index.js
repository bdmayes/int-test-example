import cconfig from 'cconfig';
import express from 'express';
import http from 'http';

import { getSomething } from 'lib/routes';

export const app = express();
const { PORT } = cconfig();

app.get('/', (req, res) => {
  res.send('OK');
});

app.get('/something', async (req, res, next) => {
  const { query: { name } } = req;

  try {
    const theThing = await getSomething(name);
    res.send(theThing);
  } catch (err) {
    next(err);
  }
});

export default (cb) => {
  try {
    http.createServer(app).listen(PORT);
    cb();
  } catch (err) {
    cb(err);
  }
};
