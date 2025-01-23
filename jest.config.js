export default {
    transform: {},
    testEnvironment: 'node',
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    testMatch: ['**/templates/express_mysql/api.test.js'],
    globals: {
      'ts-jest': {
        useESM: true,
      },
    },
  };
  