import start from 'index';

const mockGetSomething = jest.fn();

jest.mock('lib/routes', () => jest.fn(() => ({
  getSomething: mockGetSomething,
})));

jest.mock('express', () => jest.fn(() => ({
  get: jest.fn(),
})));

jest.mock('http', () => ({
  createServer: jest.fn(() => ({
    listen: jest.fn(),
  })),
}));

beforeEach(() => {
  mockGetSomething.mockClear();
});

describe('index', () => {
  it('should not error on startup', (testDone) => {
    start((err) => {
      expect(err).toBeUndefined();
    });

    testDone();
  });
});
