// @flow
import test from 'ava';
import Lexer from '../src/lexer';
import Parser from '../src/parser';
import * as ast from '../src/ast';
import * as object from '../src/object';
import Environment from '../src/environment';
import Eval, { NULL } from '../src/evaluator';

const testEval = (input: string): ?object.Obj => {
  const l: Lexer = new Lexer(input);
  const p: Parser = new Parser(l);
  const program: ast.Program = p.ParseProgram();
  const env: Environment = new Environment(new Map());

  return Eval(program, env);
};

const testIntegerObject = (t, obj: ?object.Obj, expected: number, message: ?string): void => {
  const result = ((obj: any): object.Integer);

  t.is(typeof result.Value, 'number', `typeof Value not number${message || 'Error'}`);
  t.is(result.Value, expected, `value not expected ${message || 'Error'}`);
};

const testNullObject = (t, obj: ?object.Obj): void => {
  t.is(obj, NULL);
};

const testBooleanObject = (t, obj: ?object.Obj, expected: boolean): void => {
  const result = ((obj: any): object.Boolean);

  t.is(typeof result.Value, 'boolean');
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
    const evaluated: ?object.Obj = testEval(tt.input);
    testIntegerObject(t, evaluated, tt.expected);
  });

  t.pass();
});

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
    const evaluated: ?object.Obj = testEval(tt.input);
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
    const evaluated: ?object.Obj = testEval(tt.input);
    testBooleanObject(t, evaluated, tt.expected);
  });

  t.pass();
});

test('if else expressions', (t) => {
  const tests: Array<{
    input: string,
    expected: any,
  }> = [
    { input: 'if (true) { 10 }', expected: 10 },
    { input: 'if (false) { 10 }', expected: null },
    { input: 'if (1) { 10 }', expected: 10 },
    { input: 'if (1 < 2) { 10 }', expected: 10 },
    { input: 'if (1 > 2) { 10 }', expected: null },
    { input: 'if (1 > 2) { 10 } else { 20 }', expected: 20 },
    { input: 'if (1 < 2) { 10 } else { 20 }', expected: 10 },
  ];

  tests.forEach((tt) => {
    const evaluated: ?object.Obj = testEval(tt.input);
    if (typeof tt.expected === 'number') {
      testIntegerObject(t, evaluated, tt.expected);
    } else {
      testNullObject(t, evaluated);
    }
  });

  t.pass();
});

test('return statements', (t) => {
  const tests: Array<{
    input: string,
    expected: any,
  }> = [
    { input: 'return 10;', expected: 10 },
    { input: 'return 10; 9;', expected: 10 },
    { input: '9; return 2 * 5; 9;', expected: 10 },
    {
      input: `
      if (10 > 1) {
        if (10 > 1) {
          return 10;
        }

        return 1;
      }`,
      expected: 10,
    },
  ];

  tests.forEach((tt) => {
    const evaluated: ?object.Obj = testEval(tt.input);
    testIntegerObject(t, evaluated, tt.expected);
  });

  t.pass();
});

test('error handling', (t) => {
  const tests: Array<{
    input: string,
    expected: string,
  }> = [
    { input: '5 + true;', expected: 'type mismatch: INTEGER + BOOLEAN' },
    { input: '5 + true; 5;', expected: 'type mismatch: INTEGER + BOOLEAN' },
    { input: '-true', expected: 'unknown operator: -BOOLEAN' },
    { input: 'true + false', expected: 'unknown operator: BOOLEAN + BOOLEAN' },
    { input: '5; true + false; 5;', expected: 'unknown operator: BOOLEAN + BOOLEAN' },
    { input: 'if (10 > 1) { true + false; }', expected: 'unknown operator: BOOLEAN + BOOLEAN' },
    {
      input: 'if (10 > 1) { if (10 > 1) { return true + false; } return 1; }',
      expected: 'unknown operator: BOOLEAN + BOOLEAN',
    },
    {
      input: 'foobar',
      expected: 'identifier not found: foobar',
    },
    {
      input: '"Hello" - "World"',
      expected: 'unknown operator: STRING - STRING',
    },
  ];

  tests.forEach((tt, idx) => {
    const evaluated: ?object.Obj = testEval(tt.input);
    t.is(evaluated.constructor, object.Error, `test constructor case[${idx}]`);
    t.is(((evaluated: any): object.Error).Message, tt.expected, `test expected case[${idx}]`);
  });

  t.pass();
});

test('let statements', (t) => {
  const tests: Array<{
    input: string,
    expected: number,
  }> = [
    { input: 'let a = 5; a;', expected: 5 },
    { input: 'let a = 5 * 5; a;', expected: 25 },
    { input: 'let a = 5; let b = a; b;', expected: 5 },
    { input: 'let a = 5; let b = a; let c = a + b + 5; c;', expected: 15 },
  ];

  tests.forEach((tt) => {
    testIntegerObject(t, testEval(tt.input), tt.expected);
  });
});

test('function object', (t) => {
  const input: string = 'fn(x) { x + 2; };';

  const evaluated: object.Obj = testEval(input);
  const fn: object.Func = ((evaluated: any): object.Func);

  if (fn.constructor !== object.Func) {
    t.fail(`object is not Function. got=${fn.constructor}`);
  }
  if (fn.Parameters.length !== 1) {
    t.fail(`function has wrong parameters. Parameters=${fn.Parameters.toString()}`);
  }
  if (fn.Parameters[0].toString() !== 'x') {
    t.fail(`parameter is not 'x'. got=${fn.Parameters[0]}`);
  }

  const expectedBody: string = '(x + 2)';

  t.is(fn.Body.toString(), expectedBody);
});

test('function application', (t) => {
  const tests: Array<{
    input: string,
    expected: number,
  }> = [
    { input: 'let identity = fn(x) { x; }; identity(5);', expected: 5 },
    { input: 'let identity = fn(x) { return x; }; identity(5);', expected: 5 },
    { input: 'let double = fn(x) { x * 2; }; double(5);', expected: 10 },
    { input: 'let add = fn(x, y) { x + y; }; add(5, 5);', expected: 10 },
    { input: 'let add = fn(x, y) { x + y; }; add(5 + 5, add(5, 5));', expected: 20 },
    { input: 'fn(x) { x; }(5)', expected: 5 },
  ];

  tests.forEach((tt, idx) => {
    testIntegerObject(t, testEval(tt.input), tt.expected, `fail case[${idx + 1}]`);
  });
});

test('closures', (t) => {
  const input: string = `
  let newAdder = fn(x) {
    fn(y) { x + y };
  };
  let addTwo = newAdder(2);
  addTwo(2);
  `;

  testIntegerObject(t, testEval(input), 4);
});

test('string literal', (t) => {
  const input: string = '"Hello World!"';

  const evaluated: object.Obj = testEval(input);
  const str: object.String = ((evaluated: any): object.String);

  t.is(str.constructor, object.String);
  t.is(str.Value, 'Hello World!');
});

test('string concatenation', (t) => {
  const input: string = '"Hello" + " " + "World!"';

  const evaluated: object.Obj = testEval(input);
  const str: object.String = ((evaluated: any): object.String);

  t.is(str.constructor, object.String);
  t.is(str.Value, 'Hello World!');
});

test('builtin functions', (t) => {
  const tests: Array<{
    input: string,
    expected: number | string,
  }> = [
    { input: 'len("")', expected: 0 },
    { input: 'len("four")', expected: 4 },
    { input: 'len("hello world")', expected: 11 },
    { input: 'len(1)', expected: 'argument to `len` not supported, got INTEGER' },
    { input: 'len("one", "two")', expected: 'wrong number of arguments. got=2, want=1' },
  ];

  tests.forEach((tt) => {
    const evaluated: object.Obj = testEval(tt.input);
    let errObj;

    switch (typeof tt.expected) {
      case 'number':
        testIntegerObject(t, evaluated, tt.expected);
        break;
      case 'string':
        errObj = ((evaluated: any): object.Error);
        t.is(errObj.constructor, object.Error);
        t.is(errObj.Message, tt.expected);
        break;
      default:
        break;
    }
  });
});

test('array literals', (t) => {
  const input: string = '[1, 2 * 2, 3 + 3]';

  const evaluated: object.Obj = testEval(input);
  const array: object.Array = ((evaluated: any): object.Array);

  t.is(array.constructor, object.Array);
  t.is(array.Elements.length, 3);

  testIntegerObject(t, array.Elements[0], 1);
  testIntegerObject(t, array.Elements[1], 4);
  testIntegerObject(t, array.Elements[2], 6);
});
