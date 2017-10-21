'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Start = undefined;

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

var _lexer = require('./lexer');

var _lexer2 = _interopRequireDefault(_lexer);

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

var _token = require('./token');

var token = _interopRequireWildcard(_token);

var _ast = require('./ast');

var ast = _interopRequireWildcard(_ast);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var printToken = function printToken(out, tok) {
  out.write('{ Type: ' + tok.Type + ', Literal: ' + tok.Literal + ' }\n');
};


var PROMPT = '>> ';

var printParserError = function printParserError(output, errors) {
  errors.forEach(function (err) {
    output.write('\t' + err + '\n');
  });
};

var Start = exports.Start = function Start(input, output) {
  var rl = _readline2.default.createInterface({
    input: input,
    output: output
  });

  output.write(PROMPT);
  rl.on('line', function (line) {
    var l = new _lexer2.default(line);
    var p = new _parser2.default(l);

    var program = p.ParseProgram();
    if (p.Errors().length !== 0) {
      printParserError(output, p.Errors());
      output.write(PROMPT);
      return;
    }

    output.write(program.toString());
    output.write('\n');
    output.write(PROMPT);
  });
};