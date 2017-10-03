'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ILLEGAL = exports.ILLEGAL = 'ILLEGAL';
var EOF = exports.EOF = 'EOF';

// Identifiers + literals
var IDENT = exports.IDENT = 'IDENT';
var INT = exports.INT = 'INT';

// Operators
var ASSIGN = exports.ASSIGN = '=';
var PLUS = exports.PLUS = '+';

// Delimiters
var COMMA = exports.COMMA = ',';
var SEMICOLON = exports.SEMICOLON = ';';

var LPARE = exports.LPARE = '(';
var RPARE = exports.RPARE = ')';
var LBRAC = exports.LBRAC = '{';
var RBRAC = exports.RBRAC = '}';

// Keywords
var FUNCTION = exports.FUNCTION = 'FUNCTION';
var LET = exports.LET = 'LET';