// @flow
import * as token from './token';

export interface Node {
  TokenLiteral(): string;
}

export interface Statement extends Node {
  statementNode(): void;
}

export interface Expression extends Node {
  expressionNode(): void;
}

export class Program {
  Statements: Array<Statement>;

  TokenLiteral(): string {
    if (this.Statements.length > 0) {
      return this.Statements[0].TokenLiteral();
    }
    return '';
  }
}

export class LetStatement implements Statement {
  Token: token.Token;
  Name: Identifier;
  Value: Expression;

  constructor(tok: token.Token) {
    this.Token = tok;
  }

  statementNode() {}
  TokenLiteral(): string {
    return this.Token.Literal;
  }
}

export class Identifier implements Expression {
  Token: token.Token;
  Value: string;

  constructor(tok: token.Token, val: string) {
    this.Token = tok;
    this.Value = val;
  }

  expressionNode() {}
  TokenLiteral(): string {
    return this.Token.Literal;
  }
}
