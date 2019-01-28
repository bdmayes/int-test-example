import log from 'llog';
import index from 'index';
import { onUncaughtException, onUnhandledRejection } from 'bin/int-test-example';

jest.mock('lib/redisSvc');

jest.mock('llog', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

jest.mock('index', () => ({
  default: jest.fn(),
}));


describe('onUncaughtException', () => {
  it('handles uncaught exception', () => {
    expect(() => {
      onUncaughtException('this is an error');
      expect(log.error).toHaveBeenCalledTimes(2);
    }).toThrow();
  });
});

describe('onUnhandledRejection', () => {
  it('handles unhandled rejection', () => {
    expect(() => {
      onUnhandledRejection(new Promise(() => {}));
    }).toThrow();
  });
});

describe('int-test-example', () => {
  it('should start service', () => {
    require('bin/int-test-example');
    expect(index.default).toBeCalled();
    expect(log.info).toBeCalled();
    expect(log.info.mock.calls[0][0]).toContain('int-test-example:1.0.0 starting on port 3000 in test mode');
  });
});
