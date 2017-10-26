'use strict';

var _repl = require('./repl');

var _repl2 = _interopRequireDefault(_repl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function main() {
  var username = process.env.USER;
  if (!username) {
    throw new Error('Invalid process. User not found');
  }

  process.stdout.write('Hello ' + username + '! This is the Monkey programming language!\n');
  process.stdout.write('Feel free to type in commands\n');
  (0, _repl2.default)(process.stdin, process.stdout);
})();