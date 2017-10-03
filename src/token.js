/* @flow */

export type TokenType = string;
export type Token = {
  Type: TokenType,
  Literal: string,
};

export const ILLEGAL: string = 'ILLEGAL';
export const EOF: string = 'EOF';

// Identifiers + literals
export const IDENT: string = 'IDENT';
export const INT: string = 'INT';

// Operators
export const ASSIGN: string = '=';
export const PLUS: string = '+';

// Delimiters
export const COMMA: string = ',';
export const SEMICOLON: string = ';';

export const LPARE: string = '(';
export const RPARE: string = ')';
export const LBRAC: string = '{';
export const RBRAC: string = '}';

// Keywords
export const FUNCTION: string = 'FUNCTION';
export const LET: string = 'LET';
