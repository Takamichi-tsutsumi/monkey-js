// @flow

import * as ast from './ast';
import Lexer from './lexer';
import * as token from './token';

export default class Parser {
  l: Lexer;

  curToken: token.Token;
  peekToken: token.Token;
  errors: Array<string>;

  constructor(l: Lexer): void {
    this.l = l;
    this.errors = [];

    this.nextToken();
    this.nextToken();
  }

  nextToken(): void {
    this.curToken = this.peekToken;
    this.peekToken = this.l.nextToken();
  }

  ParseProgram(): ast.Program {
    const program: ast.Program = new ast.Program();
    program.Statements = [];

    while (this.curToken.Type !== token.EOF) {
      const stmt: ?ast.Statement = this.parseStatement();
      if (stmt) {
        program.Statements.push(stmt);
      }
      this.nextToken();
    }

    return program;
  }

  parseStatement(): ?ast.Statement {
    switch (this.curToken.Type) {
      case token.LET:
        return this.parseLetStatement();
      default:
        return null;
    }
  }

  parseLetStatement(): ?ast.LetStatement {
    const stmt: ast.LetStatement = new ast.LetStatement(this.curToken);
    // console.log(stmt);

    if (!this.expectPeek(token.IDENT)) {
      return null;
    }

    stmt.Name = new ast.Identifier(this.curToken, this.curToken.Literal);

    if (!this.expectPeek(token.ASSIGN)) {
      return null;
    }

    // TODO: skipping the expressions until we encounter a semicolon

    while (!this.curTokenIs(token.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  curTokenIs(t: token.TokenType): boolean {
    return this.curToken.Type === t;
  }

  peekTokenIs(t: token.TokenType): boolean {
    return this.peekToken.Type === t;
  }

  expectPeek(t: token.TokenType): boolean {
    if (this.peekTokenIs(t)) {
      this.nextToken();
      return true;
    }

    this.peekError(t);
    return false;
  }

  Errors(): Array<string> {
    return this.errors;
  }

  peekError(t: token.TokenType): void {
    const msg = `expected next token to be ${t}, got ${this.peekToken.Type} instead`;
    this.errors.push(msg);
  }
}
