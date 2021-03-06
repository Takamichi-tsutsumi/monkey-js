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

const testIntegerLiteral = (t, il: ast.Expression, value: number): boolean => {
  const integ: ast.IntegerLiteral = ((il: any): ast.IntegerLiteral);

  t.is(integ.Value, value);
  t.is(integ.TokenLiteral(), value.toString());

  return true;
};

const testIdentifier = (t, exp: ast.Expression, value: string): boolean => {
  const ident = ((exp: any): ast.Identifier);

  t.is(ident.Value, value);

  t.is(ident.TokenLiteral(), value);

  return true;
};

const testBoolean = (t, exp: ast.Expression, value: boolean): boolean => {
  const bool = ((exp: any): ast.Boolean);

  t.is(bool.Value, value);

  t.is(bool.TokenLiteral(), value.toString());

  return true;
};

const testLiteralExpression = (t, exp: ast.Expression, expected: any): boolean => {
  const v = expected;

  switch (typeof v) {
    case 'number':
      return testIntegerLiteral(t, exp, v);
    case 'string':
      return testIdentifier(t, exp, v);
    case 'boolean':
      return testBoolean(t, exp, v);
    default:
      t.fail(`type of exp not handled. got=${exp.toString()}`);
  }

  return false;
};

const testInfixExpression = (t, exp: ast.Expression, left: any, operator: string, right: any) => {
  const opExp = ((exp: any): ast.InfixExpression);

  testLiteralExpression(t, opExp.Left, left);

  t.is(opExp.Operator, operator);

  testLiteralExpression(t, opExp.Right, right);

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

  const tests: Array<{
    input: string,
    expectedIdentifier: string,
    expectedValue: any,
  }> = [
    { input: 'let x = 5;', expectedIdentifier: 'x', expectedValue: 5 },
    { input: 'let y = true;', expectedIdentifier: 'y', expectedValue: true },
    { input: 'let foobar = y;', expectedIdentifier: 'foobar', expectedValue: 'y' },
  ];

  tests.forEach((tt) => {
    const lx: Lexer = new Lexer(tt.input);
    const pr: Parser = new Parser(lx);

    const prog: ast.Program = pr.ParseProgram();
    checkParserErrors(t, pr);

    t.is(prog.Statements.length, 1);

    const stmt: ast.Statement = prog.Statements[0];
    testLetStatement(t, stmt, tt.expectedIdentifier);

    const val: ast.LetStatement = ((stmt: any): ast.LetStatement);
    t.log(val.toString());

    testLiteralExpression(t, val.Value, tt.expectedValue);
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

test('test parsing prefix expressions', (t) => {
  const tests: Array<{
    input: string,
    operator: string,
    integerValue: number,
  }> = [
    { input: '!5;', operator: '!', integerValue: 5 },
    { input: '-15;', operator: '-', integerValue: 15 },
  ];

  tests.forEach((tt) => {
    const l: Lexer = new Lexer(tt.input);
    const p: Parser = new Parser(l);
    const program: ast.Program = p.ParseProgram();
    checkParserErrors(t, p);

    t.is(program.Statements.length, 1);

    const stmt: ast.ExpressionStatement = ((program.Statements[0]: any): ast.ExpressionStatement);

    const exp: ast.PrefixExpression = ((stmt.Expression: any): ast.PrefixExpression);

    t.is(exp.Operator, tt.operator);

    testIntegerLiteral(t, exp.Right, tt.integerValue);

    t.pass();
  });
});

test('test parsing infix expressions', (t) => {
  const infixTests: Array<{
    input: string,
    leftValue: number,
    operator: string,
    rightValue: number,
  }> = [
    { input: '5 + 5;', leftValue: 5, operator: '+', rightValue: 5 },
    { input: '5 - 5;', leftValue: 5, operator: '-', rightValue: 5 },
    { input: '5 * 5;', leftValue: 5, operator: '*', rightValue: 5 },
    { input: '5 / 5;', leftValue: 5, operator: '/', rightValue: 5 },
    { input: '5 > 5;', leftValue: 5, operator: '>', rightValue: 5 },
    { input: '5 < 5;', leftValue: 5, operator: '<', rightValue: 5 },
    { input: '5 == 5;', leftValue: 5, operator: '==', rightValue: 5 },
    { input: '5 != 5;', leftValue: 5, operator: '!=', rightValue: 5 },
  ];

  infixTests.forEach((tt) => {
    const l: Lexer = new Lexer(tt.input);
    const p: Parser = new Parser(l);
    const program: ast.Program = p.ParseProgram();
    checkParserErrors(t, p);

    t.is(program.Statements.length, 1);

    const stmt: ast.ExpressionStatement = ((program.Statements[0]: any): ast.ExpressionStatement);

    const exp: ast.InfixExpression = ((stmt.Expression: any): ast.InfixExpression);

    testIntegerLiteral(t, exp.Right, tt.leftValue);

    t.is(exp.Operator, tt.operator);

    testIntegerLiteral(t, exp.Left, tt.rightValue);
  });
  t.pass();
});

test('test operator precedence parsing', (t) => {
  const tests: Array<{ input: string, expected: string }> = [
    { input: '!-a', expected: '(!(-a))' },
    { input: 'a + b + c', expected: '((a + b) + c)' },
    { input: 'a + b - c', expected: '((a + b) - c)' },
    { input: 'a * b * c', expected: '((a * b) * c)' },
    { input: 'a * b / c', expected: '((a * b) / c)' },
    { input: 'a + b / c', expected: '(a + (b / c))' },
    { input: 'a + b * c + d / e - f', expected: '(((a + (b * c)) + (d / e)) - f)' },
    { input: '3 + 4; -5 * 5', expected: '(3 + 4)((-5) * 5)' },
    { input: '5 > 4 == 3 < 4', expected: '((5 > 4) == (3 < 4))' },
    { input: '5 < 4 != 3 > 4', expected: '((5 < 4) != (3 > 4))' },
    { input: '3 + 4 * 5 == 3 * 1 + 4 * 5', expected: '((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))' },
    { input: 'true', expected: 'true' },
    { input: 'false', expected: 'false' },
    { input: '3 > 5 == false', expected: '((3 > 5) == false)' },
    { input: '3 < 5 == true', expected: '((3 < 5) == true)' },
    { input: '1 + (2 + 3) + 4', expected: '((1 + (2 + 3)) + 4)' },
    { input: '(5 + 5) * 2', expected: '((5 + 5) * 2)' },
    { input: '2 / (5 + 5)', expected: '(2 / (5 + 5))' },
    { input: '-(5 + 5)', expected: '(-(5 + 5))' },
    { input: '!(true == true)', expected: '(!(true == true))' },
    { input: 'a * [1, 2, 3, 4][b * c] * d', expected: '((a * ([1, 2, 3, 4][(b * c)])) * d)' },
    {
      input: 'add(a * b[2], b[1], 2 * [1, 2][1])',
      expected: 'add((a * (b[2])), (b[1]), (2 * ([1, 2][1])))',
    },
  ];

  tests.forEach((tt) => {
    const l: Lexer = new Lexer(tt.input);
    const p: Parser = new Parser(l);
    const program: ast.Program = p.ParseProgram();
    checkParserErrors(t, p);

    t.is(program.toString(), tt.expected);
  });
});

test('test boolean literal expression', (t) => {
  const input: string = 'true;';

  const l: Lexer = new Lexer(input);
  const p: Parser = new Parser(l);

  const program: ast.Program = p.ParseProgram();
  checkParserErrors(t, p);

  t.is(program.Statements.length, 1);

  const stmt: ast.ExpressionStatement = ((program.Statements[0]: any): ast.ExpressionStatement);
  const literal: ast.Boolean = ((stmt.Expression: any): ast.Boolean);

  t.is(literal.Value, true);

  t.is(literal.TokenLiteral(), 'true');
});

test('test if expression', (t) => {
  const input: string = 'if (x < y) { x }';

  const l: Lexer = new Lexer(input);
  const p: Parser = new Parser(l);

  const program: ast.Program = p.ParseProgram();
  checkParserErrors(t, p);

  t.is(program.Statements.length, 1);

  const stmt: ast.ExpressionStatement = ((program.Statements[0]: any): ast.ExpressionStatement);
  const exp: ast.IfExpression = ((stmt.Expression: any): ast.IfExpression);

  testInfixExpression(t, exp.Condition, 'x', '<', 'y');
  t.is(exp.Consequence.Statements.length, 1);
  const consequence: ast.ExpressionStatement = ((exp.Consequence
    .Statements[0]: any): ast.ExpressionStatement);
  testIdentifier(t, consequence.Expression, 'x');

  t.is(exp.Alternative, undefined);

  t.pass();
});

test('test if else expression', (t) => {
  const input: string = 'if (x < y) { x } else { y }';

  const l: Lexer = new Lexer(input);
  const p: Parser = new Parser(l);

  const program: ast.Program = p.ParseProgram();
  checkParserErrors(t, p);

  t.is(program.Statements.length, 1);

  const stmt: ast.ExpressionStatement = ((program.Statements[0]: any): ast.ExpressionStatement);
  const exp: ast.IfExpression = ((stmt.Expression: any): ast.IfExpression);

  testInfixExpression(t, exp.Condition, 'x', '<', 'y');
  t.is(exp.Consequence.Statements.length, 1);
  const consequence: ast.ExpressionStatement = ((exp.Consequence
    .Statements[0]: any): ast.ExpressionStatement);
  testIdentifier(t, consequence.Expression, 'x');

  if (!exp.Alternative) {
    t.fail('alternative does not exists');
    return;
  }

  t.is(exp.Alternative.Statements.length, 1);
  const alternative: ast.ExpressionStatement = ((exp.Alternative
    .Statements[0]: any): ast.ExpressionStatement);
  testIdentifier(t, alternative.Expression, 'y');

  t.pass();
});

test('test function literal parsing', (t) => {
  const input: string = 'fn(x, y) { x + y; }';

  const l: Lexer = new Lexer(input);
  const p: Parser = new Parser(l);

  const program: ast.Program = p.ParseProgram();
  checkParserErrors(t, p);

  t.is(program.Statements.length, 1);

  const stmt: ast.ExpressionStatement = ((program.Statements[0]: any): ast.ExpressionStatement);
  const func: ast.FunctionLiteral = ((stmt.Expression: any): ast.FunctionLiteral);

  t.is(func.Parameters.length, 2);

  testLiteralExpression(t, func.Parameters[0], 'x');
  testLiteralExpression(t, func.Parameters[1], 'y');

  t.is(func.Body.Statements.length, 1);

  const bodyStmt: ast.ExpressionStatement = ((func.Body
    .Statements[0]: any): ast.ExpressionStatement);

  testInfixExpression(t, bodyStmt.Expression, 'x', '+', 'y');

  t.pass();
});

test('test function parameters parsing', (t) => {
  const tests: Array<{
    input: string,
    expectedParams: Array<string>,
  }> = [
    { input: 'fn() {};', expectedParams: [] },
    { input: 'fn(x) {};', expectedParams: ['x'] },
    { input: 'fn(x, y, z) {};', expectedParams: ['x', 'y', 'z'] },
  ];

  tests.forEach((tt) => {
    const l: Lexer = new Lexer(tt.input);
    const p: Parser = new Parser(l);

    const program: ast.Program = p.ParseProgram();
    checkParserErrors(t, p);

    const stmt: ast.ExpressionStatement = ((program.Statements[0]: any): ast.ExpressionStatement);
    const func: ast.FunctionLiteral = ((stmt.Expression: any): ast.FunctionLiteral);

    t.is(func.Parameters.length, tt.expectedParams.length);

    tt.expectedParams.forEach((ident, i) => {
      testLiteralExpression(t, func.Parameters[i], ident);
    });
  });
});

test('test call expression parsing', (t) => {
  const input: string = 'add(1, 2 * 3, 4 + 5);';
  const l: Lexer = new Lexer(input);
  const p: Parser = new Parser(l);

  const program: ast.Program = p.ParseProgram();
  checkParserErrors(t, p);

  t.is(program.Statements.length, 1);

  const stmt: ast.ExpressionStatement = ((program.Statements[0]: any): ast.ExpressionStatement);
  const exp: ast.CallExpression = ((stmt.Expression: any): ast.CallExpression);

  testIdentifier(t, exp.Func, 'add');

  t.is(exp.Arguments.length, 3);

  testLiteralExpression(t, exp.Arguments[0], 1);
  testInfixExpression(t, exp.Arguments[1], 2, '*', 3);
  testInfixExpression(t, exp.Arguments[2], 4, '+', 5);
});

test('string literal expression', (t) => {
  const input: string = '"hello world";';

  const l: Lexer = new Lexer(input);
  const p: Parser = new Parser(l);

  const program: ast.Program = p.ParseProgram();
  checkParserErrors(t, p);

  t.is(program.Statements.length, 1);

  const stmt: ast.ExpressionStatement = ((program.Statements[0]: any): ast.ExpressionStatement);
  const literal: ast.StringLiteral = ((stmt.Expression: any): ast.StringLiteral);

  t.is(literal.Value, 'hello world');
});

test('array literals', (t) => {
  const input: string = '[1, 2 * 2, 3 + 3];';

  const l: Lexer = new Lexer(input);
  const p: Parser = new Parser(l);

  const program: ast.Program = p.ParseProgram();
  checkParserErrors(t, p);

  t.is(program.Statements.length, 1);

  const stmt: ast.ExpressionStatement = ((program.Statements[0]: any): ast.ExpressionStatement);
  const array: ast.ArrayLiteral = ((stmt.Expression: any): ast.ArrayLiteral);

  t.is(array.constructor, ast.ArrayLiteral);
  t.is(array.Elements.length, 3);

  testIntegerLiteral(t, array.Elements[0], 1);
  testInfixExpression(t, array.Elements[1], 2, '*', 2);
  testInfixExpression(t, array.Elements[2], 3, '+', 3);
});

test('empty array', (t) => {
  const input: string = '[];';

  const l: Lexer = new Lexer(input);
  const p: Parser = new Parser(l);

  const program: ast.Program = p.ParseProgram();
  checkParserErrors(t, p);

  t.is(program.Statements.length, 1);

  const stmt: ast.ExpressionStatement = ((program.Statements[0]: any): ast.ExpressionStatement);
  const array: ast.ArrayLiteral = ((stmt.Expression: any): ast.ArrayLiteral);

  t.is(array.constructor, ast.ArrayLiteral);
  t.is(array.Elements.length, 0);
});

test('parse index expression', (t) => {
  const input: string = 'myArray[1 + 1];';

  const l: Lexer = new Lexer(input);
  const p: Parser = new Parser(l);

  const program: ast.Program = p.ParseProgram();
  checkParserErrors(t, p);

  const stmt: ast.ExpressionStatement = ((program.Statements[0]: any): ast.ExpressionStatement);
  const indexExp: ast.IndexExpression = ((stmt.Expression: any): ast.IndexExpression);

  t.is(indexExp.constructor, ast.IndexExpression);
  testIdentifier(t, indexExp.Left, 'myArray');
  testInfixExpression(t, indexExp.Index, 1, '+', 1);
});

test('parsing hash literals string keys', (t) => {
  const input: string = '{"one": 1, "two": 2, "three": 3}';

  const l: Lexer = new Lexer(input);
  const p: Parser = new Parser(l);

  const program: ast.Program = p.ParseProgram();
  checkParserErrors(t, p);

  const stmt: ast.ExpressionStatement = ((program.Statements[0]: any): ast.ExpressionStatement);
  const hash: ast.HashLiteral = ((stmt.Expression: any): ast.HashLiteral);

  t.is(hash.constructor, ast.HashLiteral);
  t.is(hash.Pairs.size, 3);

  const expected: { string: number } = {
    one: 1,
    two: 2,
    three: 3,
  };

  let key;
  for (key of hash.Pairs.keys()) {
    const literal = ((key: any): ast.StringLiteral);
    t.is(literal.constructor, ast.StringLiteral);
    t.is(expected[literal.toString()], hash.Pairs.get(key).Value);
  }
});

test('parsing empty hash literal', (t) => {
  const input: string = '{}';

  const l: Lexer = new Lexer(input);
  const p: Parser = new Parser(l);

  const program: ast.Program = p.ParseProgram();
  checkParserErrors(t, p);

  const stmt: ast.ExpressionStatement = ((program.Statements[0]: any): ast.ExpressionStatement);
  const hash: ast.HashLiteral = ((stmt.Expression: any): ast.HashLiteral);

  t.is(hash.constructor, ast.HashLiteral);
  t.is(hash.Pairs.size, 0);
});

test('parsing hash literals with expressions', (t) => {
  const input: string = '{"one": 0 + 1, "two": 10 - 8, "three": 15/5}';

  const l: Lexer = new Lexer(input);
  const p: Parser = new Parser(l);

  const program: ast.Program = p.ParseProgram();
  checkParserErrors(t, p);

  const stmt: ast.ExpressionStatement = ((program.Statements[0]: any): ast.ExpressionStatement);
  const hash: ast.HashLiteral = ((stmt.Expression: any): ast.HashLiteral);

  t.is(hash.constructor, ast.HashLiteral);
  t.is(hash.Pairs.size, 3);

  const tests: { string: ast.Expression => void } = {
    one: (e: ast.Expression) => {
      testInfixExpression(t, e, 0, '+', 1);
    },
    two: (e: ast.Expression) => {
      testInfixExpression(t, e, 10, '-', 8);
    },
    three: (e: ast.Expression) => {
      testInfixExpression(t, e, 15, '/', 5);
    },
  };

  let key;
  for (key of hash.Pairs.keys()) {
    const literal: ast.StringLiteral = ((key: any): ast.StringLiteral);
    t.is(literal.constructor, ast.StringLiteral);
    const testFunc: () => ast.Expression = tests[literal.toString()];
    testFunc(hash.Pairs.get(key));
  }
});
