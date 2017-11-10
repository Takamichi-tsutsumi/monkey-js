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

export const STRING: string = 'STRING';

// Operators
export const ASSIGN: string = 'ASSIGN';
export const PLUS: string = 'PLUS';
export const MINUS: string = 'MINUS';
export const BANG: string = 'BANG';
export const ASTERISK: string = 'ASTERISK';
export const SLASH: string = 'SLASH';

export const LT: string = 'LT';
export const GT: string = 'GT';

export const EQ: string = 'EQ';
export const NOT_EQ: string = 'NOT_EQ';

// Delimiters
export const COMMA: string = 'COMMA';
export const SEMICOLON: string = 'SEMICOLON';

export const LPAREN: string = 'LPAREN';
export const RPAREN: string = 'RPAREN';
export const LBRACE: string = 'LBRACE';
export const RBRACE: string = 'RBRACE';

// Keywords
export const FUNCTION: string = 'FUNCTION';
export const LET: string = 'LET';
export const TRUE: string = 'TRUE';
export const FALSE: string = 'FALSE';
export const IF: string = 'IF';
export const ELSE: string = 'ELSE';
export const RETURN: string = 'RETURN';

export const LBRACKET: string = '[';
export const RBRACKET: string = ']';

export const COLON: string = ':';

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
