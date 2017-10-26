// @flow
import test from 'ava';
import Lexer from '../src/lexer';
import Parser from '../src/parser';
import * as ast from '../src/ast';
import * as object from '../src/object';
import Eval from '../src/evaluator';

const testEval = (input: string): object.Obj => {
  const l: Lexer = new Lexer(input);
  const p: Parser = new Parser(l);
  const program: ast.Program = p.ParseProgram();

  return Eval(program);
};

const testIntegerObject = (t, obj: object.Obj, expected: number): void => {
  const result = ((obj: any): object.Integer);

  t.is(typeof result.Value, 'number');
  t.is(result.Value, expected);
};

test('test eval integer expression', (t) => {
  const tests: Array<{
    input: string,
    expected: number,
  }> = [
    { input: '5', expected: 5 },
    { input: '10', expected: 10 },
    { input: '-5', expected: -5 },
    { input: '-10', expected: -10 },
    { input: '5 + 5 + 5 + 5 - 10', expected: 10 },
    { input: '2 * 2 * 2 * 2', expected: 16 },
    { input: '-50 + 100 + -50', expected: 0 },
    { input: '5 * 2 + 10', expected: 20 },
    { input: '5 + 2 * 10', expected: 25 },
    { input: '20 + 2 * -10', expected: 0 },
    { input: '50 / 2 * 2 + 10', expected: 60 },
    { input: '2 * (5 + 10)', expected: 30 },
    { input: '3 * 3 * 3 + 10', expected: 37 },
    { input: '3 * (3 * 3) + 10', expected: 37 },
    { input: '3 * (3 * 3) + 10', expected: 37 },
    { input: '(5 + 10 * 2 + 15 / 3) * 2 + -10', expected: 50 },
  ];

  tests.forEach((tt) => {
    const evaluated: number = testEval(tt.input);
    testIntegerObject(t, evaluated, tt.expected);
  });

  t.pass();
});

const testBooleanObject = (t, obj: object.Obj, expected: boolean): void => {
  const result = ((obj: any): object.Boolean);

  t.is(typeof result.Value, 'boolean');
  t.is(result.Value, expected);
};

test('test eval boolean expression', (t) => {
  const tests: Array<{
    input: string,
    expected: boolean,
  }> = [
    { input: 'true', expected: true },
    { input: 'false', expected: false },
    { input: '1 < 2', expected: true },
    { input: '1 > 2', expected: false },
    { input: '1 < 1', expected: false },
    { input: '1 > 1', expected: false },
    { input: '1 == 1', expected: true },
    { input: '1 != 1', expected: false },
    { input: '1 == 2', expected: false },
    { input: '1 != 2', expected: true },

    { input: 'true == true', expected: true },
    { input: 'false == false', expected: true },
    { input: 'true == false', expected: false },
    { input: 'true != false', expected: true },
    { input: 'false != true', expected: true },
    { input: '(1 < 2) == true', expected: true },
    { input: '(1 < 2) == false', expected: false },
    { input: '(1 > 2) == true', expected: false },
    { input: '(1 > 2) == false', expected: true },
  ];

  tests.forEach((tt) => {
    const evaluated: boolean = testEval(tt.input);
    testBooleanObject(t, evaluated, tt.expected);
  });

  t.pass();
});

test('bang operator', (t) => {
  const tests: Array<{
    input: string,
    expected: boolean,
  }> = [
    { input: '!true', expected: false },
    { input: '!false', expected: true },
    { input: '!5', expected: false },
    { input: '!!true', expected: true },
    { input: '!!false', expected: false },
    { input: '!!5', expected: true },
  ];

  tests.forEach((tt) => {
    const evaluated: boolean = testEval(tt.input);
    testBooleanObject(t, evaluated, tt.expected);
  });

  t.pass();
});
