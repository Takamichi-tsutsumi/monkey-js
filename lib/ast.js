'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HashLiteral = exports.IndexExpression = exports.ArrayLiteral = exports.CallExpression = exports.FunctionLiteral = exports.BlockStatement = exports.IfExpression = exports.Boolean = exports.InfixExpression = exports.PrefixExpression = exports.StringLiteral = exports.IntegerLiteral = exports.Identifier = exports.ExpressionStatement = exports.ReturnStatement = exports.LetStatement = exports.Program = undefined;

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
    key: 'toString',
    value: function toString() {
      return this.Statements.map(function (stmt) {
        return stmt.toString();
      }).join('');
    }
  }, {
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
  function LetStatement(tok) {
    _classCallCheck(this, LetStatement);

    this.Token = tok;
  }

  _createClass(LetStatement, [{
    key: 'toString',
    value: function toString() {
      return this.TokenLiteral() + ' ' + this.Name.toString() + ' = ' + (this.Value ? this.Value.toString() : '') + ';';
    }
  }, {
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

var ReturnStatement = exports.ReturnStatement = function () {
  function ReturnStatement(tok) {
    _classCallCheck(this, ReturnStatement);

    this.Token = tok;
  }

  _createClass(ReturnStatement, [{
    key: 'toString',
    value: function toString() {
      return this.TokenLiteral() + ' ' + (this.ReturnValue ? this.ReturnValue.toString() : '') + ';';
    }
  }, {
    key: 'statementNode',
    value: function statementNode() {}
  }, {
    key: 'TokenLiteral',
    value: function TokenLiteral() {
      return this.Token.Literal;
    }
  }]);

  return ReturnStatement;
}();

var ExpressionStatement = exports.ExpressionStatement = function () {
  function ExpressionStatement(tok) {
    _classCallCheck(this, ExpressionStatement);

    this.Token = tok;
  }

  _createClass(ExpressionStatement, [{
    key: 'toString',
    value: function toString() {
      return this.Expression.toString();
    }
  }, {
    key: 'statementNode',
    value: function statementNode() {}
  }, {
    key: 'TokenLiteral',
    value: function TokenLiteral() {
      return this.Token.Literal;
    }
  }]);

  return ExpressionStatement;
}();

var Identifier = exports.Identifier = function () {
  _createClass(Identifier, [{
    key: 'toString',
    value: function toString() {
      return this.Value;
    }
  }]);

  function Identifier(tok, val) {
    _classCallCheck(this, Identifier);

    this.Token = tok;
    this.Value = val;
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

var IntegerLiteral = exports.IntegerLiteral = function () {
  function IntegerLiteral(tok) {
    _classCallCheck(this, IntegerLiteral);

    this.Token = tok;
  }

  _createClass(IntegerLiteral, [{
    key: 'expressionNode',
    value: function expressionNode() {}
  }, {
    key: 'TokenLiteral',
    value: function TokenLiteral() {
      return this.Token.Literal;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.Token.Literal;
    }
  }]);

  return IntegerLiteral;
}();

var StringLiteral = exports.StringLiteral = function () {
  function StringLiteral(tok, val) {
    _classCallCheck(this, StringLiteral);

    this.Token = tok;
    this.Value = val;
  }

  _createClass(StringLiteral, [{
    key: 'expressionNode',
    value: function expressionNode() {}
  }, {
    key: 'TokenLiteral',
    value: function TokenLiteral() {
      return this.Token.Literal;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.Token.Literal;
    }
  }]);

  return StringLiteral;
}();

var PrefixExpression = exports.PrefixExpression = function () {
  function PrefixExpression(tok, op) {
    _classCallCheck(this, PrefixExpression);

    this.Token = tok;
    this.Operator = op;
  }

  _createClass(PrefixExpression, [{
    key: 'expressionNode',
    value: function expressionNode() {}
  }, {
    key: 'TokenLiteral',
    value: function TokenLiteral() {
      return this.Token.Literal;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return '(' + this.Operator + this.Right.toString() + ')';
    }
  }]);

  return PrefixExpression;
}();

var InfixExpression = exports.InfixExpression = function () {
  function InfixExpression(tok, op, left) {
    _classCallCheck(this, InfixExpression);

    this.Token = tok;
    this.Operator = op;
    this.Left = left;
  }

  _createClass(InfixExpression, [{
    key: 'expressionNode',
    value: function expressionNode() {}
  }, {
    key: 'TokenLiteral',
    value: function TokenLiteral() {
      return this.Token.Literal;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return '(' + this.Left.toString() + ' ' + this.Operator + ' ' + this.Right.toString() + ')';
    }
  }]);

  return InfixExpression;
}();

var Boolean = exports.Boolean = function () {
  function Boolean(tok, val) {
    _classCallCheck(this, Boolean);

    this.Token = tok;
    this.Value = val;
  }

  _createClass(Boolean, [{
    key: 'expressionNode',
    value: function expressionNode() {}
  }, {
    key: 'TokenLiteral',
    value: function TokenLiteral() {
      return this.Token.Literal;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.Token.Literal;
    }
  }]);

  return Boolean;
}();

var IfExpression = exports.IfExpression = function () {
  function IfExpression(tok) {
    _classCallCheck(this, IfExpression);

    this.Token = tok;
  }

  _createClass(IfExpression, [{
    key: 'expressionNode',
    value: function expressionNode() {}
  }, {
    key: 'TokenLiteral',
    value: function TokenLiteral() {
      return this.Token.Literal;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return 'if ' + this.Condition.toString() + ' ' + this.Consequence.toString() + (this.Alternative ? ' else ' + this.Alternative.toString() : '');
    }
  }]);

  return IfExpression;
}();

var BlockStatement = exports.BlockStatement = function () {
  function BlockStatement(tok) {
    _classCallCheck(this, BlockStatement);

    this.Token = tok;
    this.Statements = [];
  }

  _createClass(BlockStatement, [{
    key: 'statementNode',
    value: function statementNode() {}
  }, {
    key: 'TokenLiteral',
    value: function TokenLiteral() {
      return this.Token.Literal;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.Statements.map(function (stmt) {
        return stmt.toString();
      }).join('');
    }
  }]);

  return BlockStatement;
}();

var FunctionLiteral = exports.FunctionLiteral = function () {
  // the 'fn' token
  function FunctionLiteral(tok) {
    _classCallCheck(this, FunctionLiteral);

    this.Token = tok;
  }

  _createClass(FunctionLiteral, [{
    key: 'expressionNode',
    value: function expressionNode() {}
  }, {
    key: 'TokenLiteral',
    value: function TokenLiteral() {
      return this.Token.Literal;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.TokenLiteral() + '(' + (this.Parameters ? this.Parameters.map(function (p) {
        return p.toString();
      }).join(',') : '') + ') ' + this.Body.toString();
    }
  }]);

  return FunctionLiteral;
}();

var CallExpression = exports.CallExpression = function () {
  function CallExpression(tok, func) {
    _classCallCheck(this, CallExpression);

    this.Token = tok;
    this.Func = func;
  }

  _createClass(CallExpression, [{
    key: 'expressionNode',
    value: function expressionNode() {}
  }, {
    key: 'TokenLiteral',
    value: function TokenLiteral() {
      return this.Token.Literal;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.Func.toString() + '(' + this.Arguments.map(function (arg) {
        return arg.toString();
      }).join(', ') + ')';
    }
  }]);

  return CallExpression;
}();

var ArrayLiteral = exports.ArrayLiteral = function () {
  function ArrayLiteral(tok) {
    _classCallCheck(this, ArrayLiteral);

    this.Token = tok;
  }

  _createClass(ArrayLiteral, [{
    key: 'expressionNode',
    value: function expressionNode() {}
  }, {
    key: 'TokenLiteral',
    value: function TokenLiteral() {
      return this.Token.Literal;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return '[' + this.Elements.map(function (arg) {
        return arg.toString();
      }).join(', ') + ']';
    }
  }]);

  return ArrayLiteral;
}();

var IndexExpression = exports.IndexExpression = function () {
  // expression of index number

  // [
  function IndexExpression(tok, left, index) {
    _classCallCheck(this, IndexExpression);

    this.Token = tok;
    this.Left = left;
    this.Index = index;
  } // array


  _createClass(IndexExpression, [{
    key: 'expressionNode',
    value: function expressionNode() {}
  }, {
    key: 'TokenLiteral',
    value: function TokenLiteral() {
      return this.Token.Literal;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return '(' + this.Left.toString(0) + '[' + this.Index.toString(0) + '])';
    }
  }]);

  return IndexExpression;
}();

var HashLiteral = exports.HashLiteral = function () {
  function HashLiteral(tok) {
    _classCallCheck(this, HashLiteral);

    this.Token = tok;
    this.Pairs = new Map();
  }

  _createClass(HashLiteral, [{
    key: 'expressionNode',
    value: function expressionNode() {}
  }, {
    key: 'TokenLiteral',
    value: function TokenLiteral() {
      return this.Token.Literal;
    }
  }, {
    key: 'toString',
    value: function toString() {
      var _this = this;

      return '{' + Object.keys(this.Pairs).map(function (key) {
        return key + ':' + _this.Pairs[key];
      }).join(', ') + '}';
    }
  }]);

  return HashLiteral;
}();