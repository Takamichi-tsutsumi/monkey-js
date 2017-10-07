// @flow
import * as token from '../src/token';
import type { Token } from './token';

export default class Lexer {
  input: string;
  position: number; // current position in input (points to current char)
  readPosition: number; // current reading position in input (after current char)
  char: ?string; // current char under examination

  constructor(input: string): void {
    this.input = input;
    this.position = 0;
    this.readPosition = 0;
    this.readChar();
  }

  readChar(): void {
    if (this.readPosition >= this.input.length) {
      this.char = null;
    } else {
      this.char = this.input[this.readPosition];
    }

    this.position = this.readPosition;
    this.readPosition += 1;
  }

  readIdentifier(): string {
    const position = this.position;
    while (Lexer.isLetter(this.char)) {
      this.readChar();
    }

    return this.input.substring(position, this.position);
  }

  readNumber(): string {
    const position = this.position;
    while (Lexer.isDigit(this.char)) {
      this.readChar();
    }

    return this.input.substring(position, this.position);
  }

  skipWhitespace(): void {
    while (this.char === ' ' || this.char === '\t' || this.char === '\n' || this.char === '\r') {
      this.readChar();
    }
  }

  nextToken(): Token {
    let tok: Token = { Literal: '', Type: '' };

    this.skipWhitespace();

    switch (this.char) {
      case '=':
        tok = token.newToken(token.ASSIGN, this.char);
        break;
      case ';':
        tok = token.newToken(token.SEMICOLON, this.char);
        break;
      case '(':
        tok = token.newToken(token.LPARE, this.char);
        break;
      case ')':
        tok = token.newToken(token.RPARE, this.char);
        break;
      case ',':
        tok = token.newToken(token.COMMA, this.char);
        break;
      case '+':
        tok = token.newToken(token.PLUS, this.char);
        break;
      case '{':
        tok = token.newToken(token.LBRAC, this.char);
        break;
      case '}':
        tok = token.newToken(token.RBRAC, this.char);
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

  static isLetter(char: ?string): boolean {
    if (!char) return false;

    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === '_';
  }

  static isDigit(char: ?string): boolean {
    if (!char) return false;

    return char >= '0' && char <= '9';
  }
}
