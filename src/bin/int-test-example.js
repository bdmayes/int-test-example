import cconfig from 'cconfig';
import log from 'llog';
import pjson from '../../package.json';

const config = cconfig();

export const onUncaughtException = (err) => {
  log.error(`error: uncaughtException!!! ${err}`);
  log.error(err.toString());
  throw err;
};

process.on('uncaughtException', onUncaughtException);

export const onUnhandledRejection = (err) => {
  log.error(`error: unhandledRejection!!! ${err}`);
  log.error(err.toString());
  throw err;
};

process.on('unhandledRejection', onUnhandledRejection);

log.info(`${pjson.name}:${pjson.version} starting on port ${config.PORT} in ${config.NODE_ENV} mode`);

const start = require('index').default;

start((err) => {
  if (err) {
    throw err;
  } else {
    log.info(`${pjson.name}:${pjson.version} started on port ${config.PORT} in ${config.NODE_ENV} mode`);
  }
});
