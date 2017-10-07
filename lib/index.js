'use strict';

var _repl = require('./repl');

var repl = _interopRequireWildcard(_repl);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

(function main() {
  var username = process.env.USER;
  if (!username) {
    throw new Error('Invalid process. User not found');
  }

  process.stdout.write('Hello ' + username + '! This is the Monkey programming language!\n');
  process.stdout.write('Feel free to type in commands\n');
  repl.Start(process.stdin, process.stdout);
})();