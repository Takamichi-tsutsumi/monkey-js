'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newToken = newToken;
exports.LookupIdent = LookupIdent;
var ILLEGAL = exports.ILLEGAL = 'ILLEGAL';
var EOF = exports.EOF = 'EOF';

// Identifiers + literals
var IDENT = exports.IDENT = 'IDENT';
var INT = exports.INT = 'INT';

var STRING = exports.STRING = 'STRING';

// Operators
var ASSIGN = exports.ASSIGN = 'ASSIGN';
var PLUS = exports.PLUS = 'PLUS';
var MINUS = exports.MINUS = 'MINUS';
var BANG = exports.BANG = 'BANG';
var ASTERISK = exports.ASTERISK = 'ASTERISK';
var SLASH = exports.SLASH = 'SLASH';

var LT = exports.LT = 'LT';
var GT = exports.GT = 'GT';

var EQ = exports.EQ = 'EQ';
var NOT_EQ = exports.NOT_EQ = 'NOT_EQ';

// Delimiters
var COMMA = exports.COMMA = 'COMMA';
var SEMICOLON = exports.SEMICOLON = 'SEMICOLON';

var LPAREN = exports.LPAREN = 'LPAREN';
var RPAREN = exports.RPAREN = 'RPAREN';
var LBRACE = exports.LBRACE = 'LBRACE';
var RBRACE = exports.RBRACE = 'RBRACE';

// Keywords
var FUNCTION = exports.FUNCTION = 'FUNCTION';
var LET = exports.LET = 'LET';
var TRUE = exports.TRUE = 'TRUE';
var FALSE = exports.FALSE = 'FALSE';
var IF = exports.IF = 'IF';
var ELSE = exports.ELSE = 'ELSE';
var RETURN = exports.RETURN = 'RETURN';

var LBRACKET = exports.LBRACKET = '[';
var RBRACKET = exports.RBRACKET = ']';

function newToken(type, char) {
  return {
    Type: type,
    Literal: char || ''
  };
}

var keywords = exports.keywords = {
  fn: FUNCTION,
  let: LET,
  true: TRUE,
  false: FALSE,
  if: IF,
  else: ELSE,
  return: RETURN
};

function LookupIdent(ident) {
  var tok = keywords[ident];
  if (tok) return tok;

  return IDENT;
}