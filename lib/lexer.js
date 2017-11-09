'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _token = require('./token');

var token = _interopRequireWildcard(_token);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Lexer = function () {
  // current char under examination

  // current position in input (points to current char)
  function Lexer(input) {
    _classCallCheck(this, Lexer);

    this.input = input;
    this.position = 0;
    this.readPosition = 0;
    this.readChar();
  } // current reading position in input (after current char)


  _createClass(Lexer, [{
    key: 'readChar',
    value: function readChar() {
      if (this.readPosition >= this.input.length) {
        this.char = null;
      } else {
        this.char = this.input[this.readPosition];
      }

      this.position = this.readPosition;
      this.readPosition += 1;
    }
  }, {
    key: 'readIdentifier',
    value: function readIdentifier() {
      var position = this.position;
      while (Lexer.isLetter(this.char)) {
        this.readChar();
      }

      return this.input.substring(position, this.position);
    }
  }, {
    key: 'readNumber',
    value: function readNumber() {
      var position = this.position;
      while (Lexer.isDigit(this.char)) {
        this.readChar();
      }

      return this.input.substring(position, this.position);
    }
  }, {
    key: 'readTwoCharToken',
    value: function readTwoCharToken() {
      var char = this.char;
      this.readChar();

      if (char && this.char) return '' + char + this.char;
      throw new Error('Not a two character token.');
    }
  }, {
    key: 'readString',
    value: function readString() {
      var position = this.position + 1;
      while (true) {
        this.readChar();

        if (this.char === '"' || !this.char) {
          break;
        }
      }

      return this.input.substring(position, this.position);
    }
  }, {
    key: 'skipWhitespace',
    value: function skipWhitespace() {
      while (this.char === ' ' || this.char === '\t' || this.char === '\n' || this.char === '\r') {
        this.readChar();
      }
    }
  }, {
    key: 'peekChar',
    value: function peekChar() {
      if (this.readPosition >= this.input.length) return null;
      return this.input[this.readPosition];
    }
  }, {
    key: 'nextToken',
    value: function nextToken() {
      var tok = { Literal: '', Type: '' };

      this.skipWhitespace();

      switch (this.char) {
        case '=':
          if (this.peekChar() === '=') {
            tok = token.newToken(token.EQ, this.readTwoCharToken());
          } else {
            tok = token.newToken(token.ASSIGN, this.char);
          }
          break;
        case ';':
          tok = token.newToken(token.SEMICOLON, this.char);
          break;
        case '(':
          tok = token.newToken(token.LPAREN, this.char);
          break;
        case ')':
          tok = token.newToken(token.RPAREN, this.char);
          break;
        case ',':
          tok = token.newToken(token.COMMA, this.char);
          break;
        case '+':
          tok = token.newToken(token.PLUS, this.char);
          break;
        case '{':
          tok = token.newToken(token.LBRACE, this.char);
          break;
        case '}':
          tok = token.newToken(token.RBRACE, this.char);
          break;
        case '!':
          if (this.peekChar() === '=') {
            tok = token.newToken(token.NOT_EQ, this.readTwoCharToken());
          } else {
            tok = token.newToken(token.BANG, this.char);
          }
          break;
        case '-':
          tok = token.newToken(token.MINUS, this.char);
          break;
        case '*':
          tok = token.newToken(token.ASTERISK, this.char);
          break;
        case '/':
          tok = token.newToken(token.SLASH, this.char);
          break;
        case '<':
          tok = token.newToken(token.LT, this.char);
          break;
        case '>':
          tok = token.newToken(token.GT, this.char);
          break;
        case '"':
          tok = token.newToken(token.STRING, this.readString());
          break;
        case '[':
          tok = token.newToken(token.LBRACKET, this.char);
          break;
        case ']':
          tok = token.newToken(token.RBRACKET, this.char);
          break;
        case null:
          tok = token.newToken(token.EOF, '');
          break;
        default:
          if (Lexer.isLetter(this.char)) {
            tok.Literal = this.readIdentifier();
            tok.Type = token.LookupIdent(tok.Literal);
            return tok;
          } else if (Lexer.isDigit(this.char)) {
            tok.Literal = this.readNumber();
            tok.Type = token.INT;
            return tok;
          }
          tok = token.newToken(token.ILLEGAL, this.char);
          break;
      }

      this.readChar();
      return tok;
    }
  }], [{
    key: 'isLetter',
    value: function isLetter(char) {
      if (!char) return false;

      return char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z' || char === '_';
    }
  }, {
    key: 'isDigit',
    value: function isDigit(char) {
      if (!char) return false;

      return char >= '0' && char <= '9';
    }
  }]);

  return Lexer;
}();

exports.default = Lexer;