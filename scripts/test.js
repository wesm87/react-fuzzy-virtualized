'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'test';
process.env.BABEL_ENV = 'test';

const jest = require('jest');
const argv = process.argv.slice(2);

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

// Watch unless on CI or explicitly running all tests
if (
  !process.env.CI &&
  !argv.includes('--watchAll') &&
  !argv.includes('--watchAll=false')
) {
  argv.push('--watch');
}

jest.run(argv);
