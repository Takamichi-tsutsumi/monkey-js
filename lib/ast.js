'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Identifier = exports.LetStatement = exports.Program = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _token = require('./token');

var token = _interopRequireWildcard(_token);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Program = exports.Program = function () {
  function Program() {
    _classCallCheck(this, Program);
  }

  _createClass(Program, [{
    key: 'TokenLiteral',
    value: function TokenLiteral() {
      if (this.Statements.length > 0) {
        return this.Statements[0].TokenLiteral();
      }
      return '';
    }
  }]);

  return Program;
}();

var LetStatement = exports.LetStatement = function () {
  function LetStatement() {
    _classCallCheck(this, LetStatement);
  }

  _createClass(LetStatement, [{
    key: 'statementNode',
    value: function statementNode() {}
  }, {
    key: 'TokenLiteral',
    value: function TokenLiteral() {
      return this.Token.Literal;
    }
  }]);

  return LetStatement;
}();

var Identifier = exports.Identifier = function () {
  function Identifier() {
    _classCallCheck(this, Identifier);
  }

  _createClass(Identifier, [{
    key: 'expressionNode',
    value: function expressionNode() {}
  }, {
    key: 'TokenLiteral',
    value: function TokenLiteral() {
      return this.Token.Literal;
    }
  }]);

  return Identifier;
}();