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

  toString(): string {
    return JSON.stringify(this);
  }

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

  toString(): string {
    return JSON.stringify(this);
  }

  statementNode(): void {}
  TokenLiteral(): string {
    return this.Token.Literal;
  }
}

export class ReturnStatement implements Statement {
  Token: token.Token;
  ReturnValue: Expression;

  constructor(tok: token.Token) {
    this.Token = tok;
  }

  toString(): string {
    return JSON.stringify(this);
  }

  statementNode(): void {}
  TokenLiteral(): string {
    return this.Token.Literal;
  }
}

export class ExpressionStatement implements Statement {
  Token: token.Token;
  Expression: Expression;

  constructor(tok: token.Token): void {
    this.Token = tok;
  }

  toString(): string {
    return JSON.stringify(this);
  }

  statementNode(): void {}
  TokenLiteral(): string {
    return this.Token.Literal;
  }
}

export class Identifier implements Expression {
  Token: token.Token;
  Value: string;

  toString(): string {
    return JSON.stringify(this);
  }

  constructor(tok: token.Token, val: string): void {
    this.Token = tok;
    this.Value = val;
  }

  expressionNode(): void {}

  TokenLiteral(): string {
    return this.Token.Literal;
  }
}

export class IntegerLiteral implements Expression {
  Token: token.Token;
  Value: number;

  constructor(tok: token.Token): void {
    this.Token = tok;
  }

  expressionNode(): void {}

  TokenLiteral(): string {
    return this.Token.Literal;
  }

  toString(): string {
    return this.Token.Literal.toString();
  }
}

export class PrefixExpression implements Expression {
  Token: token.Token;
  Operator: string;
  Right: Expression;

  constructor(tok: token.Token, op: string): void {
    this.Token = tok;
    this.Operator = op;
  }

  expressionNode(): void {}

  TokenLiteral(): string {
    return this.Token.Literal;
  }

  toString(): string {
    return `(${this.Operator}${this.Right.toString()})`;
  }
}

export class InfixExpression implements Expression {
  Token: token.Token;
  Left: Expression;
  Operator: string;
  Right: Expression;

  constructor(tok: token.Token, op: string, left: Expression): void {
    this.Token = tok;
    this.Operator = op;
    this.Left = left;
  }

  expressionNode(): void {}

  TokenLiteral(): string {
    return this.Token.Literal;
  }

  toString(): string {
    return `(${this.Left.toString()} ${this.Operator} ${this.Right.toString()})`;
  }
}

export class Boolean {
  Token: token.Token;
  Value: boolean;

  constructor(tok: token.Token, val: boolean): void {
    this.Token = tok;
    this.Value = val;
  }

  expressionNode(): void {}

  TokenLiteral(): string {
    return this.Token.Literal;
  }

  toString(): string {
    return this.Token.Literal;
  }
}
