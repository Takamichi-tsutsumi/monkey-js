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
export const MINUS: string = '-';
export const BANG: string = '!';
export const ASTERISK: string = '*';
export const SLASH: string = '/';

export const LT: string = '<';
export const GT: string = '>';

export const EQ: string = '==';
export const NOT_EQ: string = '!=';

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
export const TRUE: string = 'TRUE';
export const FALSE: string = 'FALSE';
export const IF: string = 'IF';
export const ELSE: string = 'ELSE';
export const RETURN: string = 'RETURN';

export function newToken(type: TokenType, char: ?string): Token {
  return {
    Type: type,
    Literal: char || '',
  };
}

export const keywords: { [string]: TokenType } = {
  fn: FUNCTION,
  let: LET,
  true: TRUE,
  false: FALSE,
  if: IF,
  else: ELSE,
  return: RETURN,
};

export function LookupIdent(ident: string): TokenType {
  const tok = keywords[ident];
  if (tok) return tok;

  return IDENT;
}
