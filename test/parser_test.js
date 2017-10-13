// @flow
import test from 'ava';
import * as ast from '../src/ast';
import Lexer from '../src/lexer';
import Parser from '../src/parser';

const testLetStatement = (t, s: ast.Statement, name: string): boolean => {
  if (s.TokenLiteral() !== 'let') {
    t.fail(`s.TokenLiteral not 'let'. got=${s.TokenLiteral()}`);
    return false;
  }

  if (!(s instanceof ast.LetStatement)) {
    t.fail('s is not instanceof LetStatement.');
    return false;
  }

  if (s.Name.Value !== name) {
    t.fail(`s.Name.Value not ${name}. got ${s.Name.Value}`);
    return false;
  }

  if (s.Name.TokenLiteral() !== name) {
    t.fail(`s.Name.TokenLiteral() not ${name}. got ${s.Name.TokenLiteral()}`);
    return false;
  }

  return true;
};

const checkParserErrors = (t, p: Parser): void => {
  const errors = p.Errors();
  if (errors.length === 0) return;

  t.log(`parser has ${errors.length} errors`);
  errors.forEach((err) => {
    t.log(`parser error: ${err}`);
  });

  t.fail();
};

test('test let statements', (t) => {
  const input: string = `
  let x = 5;
  let y = 10;
  let foobar = 80098;
  `;

  const l: Lexer = new Lexer(input);
  const p: Parser = new Parser(l);

  const program: ast.Program = p.ParseProgram();
  checkParserErrors(t, p);

  t.truthy(program);
  t.is(program.Statements.length, 3);

  const tests: Array<{ expectedIdentifier: string }> = [
    { expectedIdentifier: 'x' },
    { expectedIdentifier: 'y' },
    { expectedIdentifier: 'foobar' },
  ];

  tests.forEach((tt, i) => {
    const stmt: ast.Statement = program.Statements[i];
    testLetStatement(t, stmt, tt.expectedIdentifier);
  });

  t.pass();
});

test('test return statements', (t) => {
  const input: string = `
  return 5;
  return 10;
  return 99223;
  `;

  const l: Lexer = new Lexer(input);
  const p: Parser = new Parser(l);

  const program: ast.Program = p.ParseProgram();
  checkParserErrors(t, p);

  t.truthy(program);
  t.is(program.Statements.length, 3);

  program.Statements.forEach((stmt) => {
    if (stmt.TokenLiteral() !== 'return') {
      t.fail(`stmt.TokenLiteral not 'return', got=${stmt.TokenLiteral()}`);
    }
  });

  t.pass();
});

test('test identifier expression', (t) => {
  const input: string = 'foobar;';

  const l: Lexer = new Lexer(input);
  const p: Parser = new Parser(l);

  const program: ast.Program = p.ParseProgram();
  checkParserErrors(t, p);

  t.is(program.Statements.length, 1);

  const stmt: ast.ExpressionStatement = ((program.Statements[0]: any): ast.ExpressionStatement);
  const ident: ast.Identifier = ((stmt.Expression: any): ast.Identifier);

  t.is(ident.Value, 'foobar');
  t.is(ident.TokenLiteral(), 'foobar');
});

test('test integer literal expression', (t) => {
  const input: string = '5;';

  const l: Lexer = new Lexer(input);
  const p: Parser = new Parser(l);

  const program: ast.Program = p.ParseProgram();
  checkParserErrors(t, p);

  t.is(program.Statements.length, 1);

  const stmt: ast.ExpressionStatement = ((program.Statements[0]: any): ast.ExpressionStatement);
  const literal: ast.IntegerLiteral = ((stmt.Expression: any): ast.IntegerLiteral);

  t.is(literal.Value, 5);

  t.is(literal.TokenLiteral(), '5');
});
