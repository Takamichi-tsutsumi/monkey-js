// @flow
import * as token from './token';
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

  readTwoCharToken(): string {
    const char = this.char;
    this.readChar();

    if (char && this.char) return `${char}${this.char}`;
    throw new Error('Not a two character token.');
  }

  readString(): string {
    const position: number = this.position + 1;
    while (true) {
      this.readChar();

      if (this.char === '"' || !this.char) {
        break;
      }
    }

    return this.input.substring(position, this.position);
  }

  skipWhitespace(): void {
    while (this.char === ' ' || this.char === '\t' || this.char === '\n' || this.char === '\r') {
      this.readChar();
    }
  }

  peekChar(): ?string {
    if (this.readPosition >= this.input.length) return null;
    return this.input[this.readPosition];
  }

  nextToken(): Token {
    let tok: Token = { Literal: '', Type: '' };

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
