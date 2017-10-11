'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ast = require('./ast');

var ast = _interopRequireWildcard(_ast);

var _lexer = require('./lexer');

var _lexer2 = _interopRequireDefault(_lexer);

var _token = require('./token');

var token = _interopRequireWildcard(_token);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Parser = function () {
  function Parser(l) {
    _classCallCheck(this, Parser);

    this.l = l;

    this.nextToken();
    this.nextToken();
  }

  _createClass(Parser, [{
    key: 'nextToken',
    value: function nextToken() {
      this.curToken = this.peekToken;
      this.peekToken = this.l.nextToken();
    }
  }, {
    key: 'ParseProgram',
    value: function ParseProgram() {
      return null;
    }
  }]);

  return Parser;
}();

exports.default = Parser;