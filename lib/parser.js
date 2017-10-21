'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _precedences;

var _ast = require('./ast');

var ast = _interopRequireWildcard(_ast);

var _lexer = require('./lexer');

var _lexer2 = _interopRequireDefault(_lexer);

var _token = require('./token');

var token = _interopRequireWildcard(_token);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LOWEST = 1;
var EQUALS = 2;
var LESSGREATER = 3;
var SUM = 4;
var PRODUCT = 5;
var PREFIX = 6;
var CALL = 7;

var precedences = (_precedences = {}, _defineProperty(_precedences, token.EQ, EQUALS), _defineProperty(_precedences, token.NOT_EQ, EQUALS), _defineProperty(_precedences, token.LT, LESSGREATER), _defineProperty(_precedences, token.GT, LESSGREATER), _defineProperty(_precedences, token.PLUS, SUM), _defineProperty(_precedences, token.MINUS, SUM), _defineProperty(_precedences, token.SLASH, PRODUCT), _defineProperty(_precedences, token.ASTERISK, PRODUCT), _defineProperty(_precedences, token.LPAREN, CALL), _precedences);

var Parser = function () {
  function Parser(l) {
    _classCallCheck(this, Parser);

    this.l = l;
    this.errors = [];

    this.prefixParseFns = new Map();
    this.infixParseFns = new Map();

    // register parse function for prefix
    this.registerPrefix(token.IDENT, this.parseIdentifier.bind(this));
    this.registerPrefix(token.INT, this.parseIntegerLiteral.bind(this));
    this.registerPrefix(token.BANG, this.parsePrefixExpression.bind(this));
    this.registerPrefix(token.MINUS, this.parsePrefixExpression.bind(this));

    // register parse boolean
    this.registerPrefix(token.TRUE, this.parseBoolean.bind(this));
    this.registerPrefix(token.FALSE, this.parseBoolean.bind(this));

    // register grouped expression
    this.registerPrefix(token.LPAREN, this.parseGroupedExpression.bind(this));

    // register parse if expression
    this.registerPrefix(token.IF, this.parseIfExpression.bind(this));

    // register parse function literal
    this.registerPrefix(token.FUNCTION, this.parseFunctionLiteral.bind(this));

    // register parse function for infix
    this.registerInfix(token.PLUS, this.parseInfixExpression.bind(this));
    this.registerInfix(token.MINUS, this.parseInfixExpression.bind(this));
    this.registerInfix(token.SLASH, this.parseInfixExpression.bind(this));
    this.registerInfix(token.ASTERISK, this.parseInfixExpression.bind(this));
    this.registerInfix(token.EQ, this.parseInfixExpression.bind(this));
    this.registerInfix(token.NOT_EQ, this.parseInfixExpression.bind(this));
    this.registerInfix(token.LT, this.parseInfixExpression.bind(this));
    this.registerInfix(token.GT, this.parseInfixExpression.bind(this));

    // register parse call expression
    this.registerInfix(token.LPAREN, this.parseCallExpression.bind(this));

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
      var program = new ast.Program();
      program.Statements = [];

      while (this.curToken.Type !== token.EOF) {
        var stmt = this.parseStatement();
        if (stmt) {
          program.Statements.push(stmt);
        }
        this.nextToken();
      }

      return program;
    }
  }, {
    key: 'parseStatement',
    value: function parseStatement() {
      switch (this.curToken.Type) {
        case token.LET:
          return this.parseLetStatement();
        case token.RETURN:
          return this.parseReturnStatement();
        default:
          return this.parseExpressionStatement();
      }
    }
  }, {
    key: 'parseLetStatement',
    value: function parseLetStatement() {
      var stmt = new ast.LetStatement(this.curToken);

      if (!this.expectPeek(token.IDENT)) {
        return null;
      }

      stmt.Name = new ast.Identifier(this.curToken, this.curToken.Literal);

      if (!this.expectPeek(token.ASSIGN)) {
        return null;
      }

      this.nextToken();

      stmt.Value = this.parseExpression(LOWEST);

      while (!this.curTokenIs(token.SEMICOLON)) {
        this.nextToken();
      }

      return stmt;
    }
  }, {
    key: 'parseReturnStatement',
    value: function parseReturnStatement() {
      var stmt = new ast.ReturnStatement(this.curToken);

      this.nextToken();

      stmt.ReturnValue = this.parseExpression(LOWEST);

      while (!this.curTokenIs(token.SEMICOLON)) {
        this.nextToken();
      }

      return stmt;
    }
  }, {
    key: 'curTokenIs',
    value: function curTokenIs(t) {
      return this.curToken.Type === t;
    }
  }, {
    key: 'peekTokenIs',
    value: function peekTokenIs(t) {
      return this.peekToken.Type === t;
    }
  }, {
    key: 'expectPeek',
    value: function expectPeek(t) {
      if (this.peekTokenIs(t)) {
        this.nextToken();
        return true;
      }

      this.peekError(t);
      return false;
    }
  }, {
    key: 'Errors',
    value: function Errors() {
      return this.errors;
    }
  }, {
    key: 'peekError',
    value: function peekError(t) {
      var msg = 'expected next token to be ' + t + ', got ' + this.peekToken.Type + ' instead';
      this.errors.push(msg);
    }
  }, {
    key: 'registerPrefix',
    value: function registerPrefix(tokenType, fn) {
      this.prefixParseFns.set(tokenType, fn);
    }
  }, {
    key: 'registerInfix',
    value: function registerInfix(tokenType, fn) {
      this.infixParseFns.set(tokenType, fn);
    }
  }, {
    key: 'parseExpressionStatement',
    value: function parseExpressionStatement() {
      var stmt = new ast.ExpressionStatement(this.curToken);

      var exp = this.parseExpression(LOWEST);
      if (!exp) return null;

      stmt.Expression = exp;

      if (this.peekTokenIs(token.SEMICOLON)) {
        this.nextToken();
      }

      return stmt;
    }
  }, {
    key: 'parseExpression',
    value: function parseExpression(precedence) {
      var prefix = this.prefixParseFns.get(this.curToken.Type);
      if (!prefix) return null;

      var leftExp = prefix();

      while (!this.peekTokenIs(token.SEMICOLON) && precedence < this.peekPrecedence()) {
        var infix = this.infixParseFns.get(this.peekToken.Type);
        if (!infix) return leftExp;

        this.nextToken();

        if (!leftExp) return null;
        leftExp = infix(leftExp);
      }

      return leftExp;
    }
  }, {
    key: 'parseIdentifier',
    value: function parseIdentifier() {
      return new ast.Identifier(this.curToken, this.curToken.Literal);
    }
  }, {
    key: 'parseIntegerLiteral',
    value: function parseIntegerLiteral() {
      var lit = new ast.IntegerLiteral(this.curToken);

      var value = Number(this.curToken.Literal);
      lit.Value = value;

      return lit;
    }
  }, {
    key: 'noPrefixParseFnError',
    value: function noPrefixParseFnError(t) {
      var msg = 'no prefix parse function for ' + t + ' found';
      this.errors.push(msg);
    }
  }, {
    key: 'parsePrefixExpression',
    value: function parsePrefixExpression() {
      var expression = new ast.PrefixExpression(this.curToken, this.curToken.Literal);

      this.nextToken();

      var right = this.parseExpression(PREFIX);
      if (!right) return null;

      expression.Right = right;

      return expression;
    }
  }, {
    key: 'peekPrecedence',
    value: function peekPrecedence() {
      return precedences[this.peekToken.Type] || LOWEST;
    }
  }, {
    key: 'curPrecedence',
    value: function curPrecedence() {
      return precedences[this.curToken.Type] || LOWEST;
    }
  }, {
    key: 'parseInfixExpression',
    value: function parseInfixExpression(left) {
      var expression = new ast.InfixExpression(this.curToken, this.curToken.Literal, left);

      var precedence = this.curPrecedence();
      this.nextToken();

      var exp = this.parseExpression(precedence);
      if (!exp) return null;

      expression.Right = exp;

      return expression;
    }
  }, {
    key: 'parseBoolean',
    value: function parseBoolean() {
      return new ast.Boolean(this.curToken, this.curTokenIs(token.TRUE));
    }
  }, {
    key: 'parseGroupedExpression',
    value: function parseGroupedExpression() {
      this.nextToken();

      var exp = this.parseExpression(LOWEST);

      if (!this.expectPeek(token.RPAREN)) {
        return null;
      }

      return exp;
    }
  }, {
    key: 'parseIfExpression',
    value: function parseIfExpression() {
      var expression = new ast.IfExpression(this.curToken);

      if (!this.expectPeek(token.LPAREN)) return null;

      this.nextToken();
      var exp = this.parseExpression(LOWEST);
      if (!exp) return null;

      expression.Condition = exp;

      if (!this.expectPeek(token.RPAREN)) return null;

      if (!this.expectPeek(token.LBRACE)) return null;

      var blk = this.parseBlockStatement();
      if (!blk) return null;

      expression.Consequence = blk;

      if (this.peekTokenIs(token.ELSE)) {
        this.nextToken();
        if (!this.expectPeek(token.LBRACE)) return null;

        expression.Alternative = this.parseBlockStatement();
      }

      return expression;
    }
  }, {
    key: 'parseBlockStatement',
    value: function parseBlockStatement() {
      var block = new ast.BlockStatement(this.curToken);

      this.nextToken();

      if (!this.curTokenIs(token.RBRACE) && !this.curTokenIs(token.EOF)) {
        var stmt = this.parseStatement();

        if (stmt) block.Statements.push(stmt);

        this.nextToken();
      }

      return block;
    }
  }, {
    key: 'parseFunctionLiteral',
    value: function parseFunctionLiteral() {
      var lit = new ast.FunctionLiteral(this.curToken);

      if (!this.expectPeek(token.LPAREN)) return null;

      lit.Parameters = this.parseFunctionParameters();

      if (!this.expectPeek(token.LBRACE)) return null;

      var body = this.parseBlockStatement();
      if (!body) return null;

      lit.Body = body;

      return lit;
    }
  }, {
    key: 'parseFunctionParameters',
    value: function parseFunctionParameters() {
      var identifiers = [];

      if (this.peekTokenIs(token.RPAREN)) {
        this.nextToken();
        return identifiers;
      }

      this.nextToken();
      var ident = new ast.Identifier(this.curToken, this.curToken.Literal);
      identifiers.push(ident);

      while (this.peekTokenIs(token.COMMA)) {
        this.nextToken();
        this.nextToken();
        ident = new ast.Identifier(this.curToken, this.curToken.Literal);
        identifiers.push(ident);
      }

      if (!this.expectPeek(token.RPAREN)) return null;

      return identifiers;
    }
  }, {
    key: 'parseCallExpression',
    value: function parseCallExpression(func) {
      var exp = new ast.CallExpression(this.curToken, func);
      exp.Arguments = this.parseCallArguments();

      return exp;
    }
  }, {
    key: 'parseCallArguments',
    value: function parseCallArguments() {
      var args = [];

      if (this.peekTokenIs(token.RPAREN)) {
        this.nextToken();
        return args;
      }

      this.nextToken();
      args.push(this.parseExpression(LOWEST));

      while (this.peekTokenIs(token.COMMA)) {
        this.nextToken();
        this.nextToken();
        args.push(this.parseExpression(LOWEST));
      }

      if (!this.expectPeek(token.RPAREN)) return [];

      return args;
    }
  }]);

  return Parser;
}();

exports.default = Parser;