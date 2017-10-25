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
  }> = [{ input: '5', expected: 5 }, { input: '10', expected: 10 }];

  tests.forEach((tt) => {
    const evaluated: number = testEval(tt.input);
    testIntegerObject(t, evaluated, tt.expected);
  });

  t.pass();
});
