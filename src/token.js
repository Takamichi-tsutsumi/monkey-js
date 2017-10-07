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

export function newToken(type: TokenType, char: ?string): Token {
  return {
    Type: type,
    Literal: char || '',
  };
}

export const keywords: { [string]: TokenType } = {
  fn: FUNCTION,
  let: LET,
};

export function LookupIdent(ident: string): TokenType {
  const tok = keywords[ident];
  if (tok) return tok;

  return IDENT;
}
