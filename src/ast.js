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
    return this.Statements.map(stmt => stmt.toString()).join(' ');
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
    return `${this.TokenLiteral()} ${this.Name.toString()} = ${this.Value
      ? this.Value.toString()
      : ''};`;
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
    return `${this.TokenLiteral()} ${this.ReturnValue ? this.ReturnValue.toString() : ''};`;
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
    return this.Expression.toString();
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
    return this.Value;
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
    return this.Token.Literal;
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

export class IfExpression {
  Token: token.Token;
  Condition: Expression;
  Consequence: BlockStatement;
  Alternative: ?BlockStatement;

  constructor(tok: token.Token): void {
    this.Token = tok;
  }

  expressionNode(): void {}

  TokenLiteral(): string {
    return this.Token.Literal;
  }

  toString(): string {
    return `if ${this.Condition.toString()} ${this.Consequence.toString()}${this.Alternative
      ? ` else ${this.Alternative.toString()}`
      : ''}`;
  }
}

export class BlockStatement {
  Token: token.Token;
  Statements: Array<Statement>;

  constructor(tok: token.Token) {
    this.Token = tok;
    this.Statements = [];
  }

  statementNode(): void {}

  TokenLiteral(): string {
    return this.Token.Literal;
  }

  toString(): string {
    return this.Statements.map(stmt => stmt.toString()).join(' ');
  }
}

export class FunctionLiteral {
  Token: token.Token; // the 'fn' token
  Parameters: Array<Identifier>;
  Body: BlockStatement;

  constructor(tok: token.Token) {
    this.Token = tok;
  }

  expressionNode(): void {}

  TokenLiteral(): string {
    return this.Token.Literal;
  }

  toString(): string {
    return `${this.TokenLiteral()}(${this.Parameters
      ? this.Parameters.map(p => p.toString()).join(',')
      : ''}) ${this.Body.toString()}`;
  }
}

export class CallExpression {
  Token: token.Token;
  Func: Expression;
  Arguments: Array<Expression>;

  constructor(tok: token.Token, func: Expression) {
    this.Token = tok;
    this.Func = func;
  }

  expressionNode(): void {}

  TokenLiteral(): string {
    return this.Token.Literal;
  }

  toString(): string {
    return `${this.Func.toString()}(${this.Arguments.map(arg => arg.toString()).join(',')})`;
  }
}
