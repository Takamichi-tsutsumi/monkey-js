// @flow
import test from 'ava';
import * as token from '../src/token';
import type { TokenType } from '../src/token';
import Lexer from '../src/lexer';

test('test next token', (t) => {
  const input: string = '=+(){},;';
  const tests: Array<{
    expectedType: TokenType,
    expectedLiteral: string,
  }> = [
    { expectedType: token.ASSIGN, expectedLiteral: '=' },
    { expectedType: token.PLUS, expectedLiteral: '+' },
    { expectedType: token.LPAREN, expectedLiteral: '(' },
    { expectedType: token.RPAREN, expectedLiteral: ')' },
    { expectedType: token.LBRACE, expectedLiteral: '{' },
    { expectedType: token.RBRACE, expectedLiteral: '}' },
    { expectedType: token.COMMA, expectedLiteral: ',' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.EOF, expectedLiteral: '' },
  ];

  const l = new Lexer(input);

  tests.forEach((tt, i) => {
    const tok = l.nextToken();

    t.is(tt.expectedType, tok.Type, `tests[${i}] - tokentype wrong.`);
    t.is(tt.expectedLiteral, tok.Literal, `tests[${i}] - literal wrong.`);
  });

  t.pass();
});

test('test next token more like source code', (t) => {
  const input: string = `let five = 5;
  let ten = 10;

  let add = fn(x, y) {
    x + y;
  };

  let result = add(five, ten);
  `;

  const tests: Array<{
    expectedType: TokenType,
    expectedLiteral: string,
  }> = [
    { expectedType: token.LET, expectedLiteral: 'let' },
    { expectedType: token.IDENT, expectedLiteral: 'five' },
    { expectedType: token.ASSIGN, expectedLiteral: '=' },
    { expectedType: token.INT, expectedLiteral: '5' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.LET, expectedLiteral: 'let' },
    { expectedType: token.IDENT, expectedLiteral: 'ten' },
    { expectedType: token.ASSIGN, expectedLiteral: '=' },
    { expectedType: token.INT, expectedLiteral: '10' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.LET, expectedLiteral: 'let' },
    { expectedType: token.IDENT, expectedLiteral: 'add' },
    { expectedType: token.ASSIGN, expectedLiteral: '=' },
    { expectedType: token.FUNCTION, expectedLiteral: 'fn' },
    { expectedType: token.LPAREN, expectedLiteral: '(' },
    { expectedType: token.IDENT, expectedLiteral: 'x' },
    { expectedType: token.COMMA, expectedLiteral: ',' },
    { expectedType: token.IDENT, expectedLiteral: 'y' },
    { expectedType: token.RPAREN, expectedLiteral: ')' },
    { expectedType: token.LBRACE, expectedLiteral: '{' },
    { expectedType: token.IDENT, expectedLiteral: 'x' },
    { expectedType: token.PLUS, expectedLiteral: '+' },
    { expectedType: token.IDENT, expectedLiteral: 'y' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.RBRACE, expectedLiteral: '}' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.LET, expectedLiteral: 'let' },
    { expectedType: token.IDENT, expectedLiteral: 'result' },
    { expectedType: token.ASSIGN, expectedLiteral: '=' },
    { expectedType: token.IDENT, expectedLiteral: 'add' },
    { expectedType: token.LPAREN, expectedLiteral: '(' },
    { expectedType: token.IDENT, expectedLiteral: 'five' },
    { expectedType: token.COMMA, expectedLiteral: ',' },
    { expectedType: token.IDENT, expectedLiteral: 'ten' },
    { expectedType: token.RPAREN, expectedLiteral: ')' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.EOF, expectedLiteral: '' },
  ];

  const l = new Lexer(input);

  tests.forEach((tt, i) => {
    const tok = l.nextToken();

    t.is(tt.expectedType, tok.Type, `tests[${i}] - tokentype wrong.`);
    t.is(tt.expectedLiteral, tok.Literal, `tests[${i}] - literal wrong.`);
  });

  t.pass();
});

test('test next token with more operators', (t) => {
  const input: string = `
  !-/*5;
  5 < 10 > 5;
  `;
  const tests: Array<{
    expectedType: TokenType,
    expectedLiteral: string,
  }> = [
    { expectedType: token.BANG, expectedLiteral: '!' },
    { expectedType: token.MINUS, expectedLiteral: '-' },
    { expectedType: token.SLASH, expectedLiteral: '/' },
    { expectedType: token.ASTERISK, expectedLiteral: '*' },
    { expectedType: token.INT, expectedLiteral: '5' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.INT, expectedLiteral: '5' },
    { expectedType: token.LT, expectedLiteral: '<' },
    { expectedType: token.INT, expectedLiteral: '10' },
    { expectedType: token.GT, expectedLiteral: '>' },
    { expectedType: token.INT, expectedLiteral: '5' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.EOF, expectedLiteral: '' },
  ];

  const l = new Lexer(input);

  tests.forEach((tt, i) => {
    const tok = l.nextToken();

    t.is(tt.expectedType, tok.Type, `tests[${i}] - tokentype wrong.`);
    t.is(tt.expectedLiteral, tok.Literal, `tests[${i}] - literal wrong.`);
  });

  t.pass();
});

test('test next token with more keywords', (t) => {
  const input: string = `
  if (5 < 10) {
    return true;
  } else {
    return false;
  }
  `;
  const tests: Array<{
    expectedType: TokenType,
    expectedLiteral: string,
  }> = [
    { expectedType: token.IF, expectedLiteral: 'if' },
    { expectedType: token.LPAREN, expectedLiteral: '(' },
    { expectedType: token.INT, expectedLiteral: '5' },
    { expectedType: token.LT, expectedLiteral: '<' },
    { expectedType: token.INT, expectedLiteral: '10' },
    { expectedType: token.RPAREN, expectedLiteral: ')' },
    { expectedType: token.LBRACE, expectedLiteral: '{' },
    { expectedType: token.RETURN, expectedLiteral: 'return' },
    { expectedType: token.TRUE, expectedLiteral: 'true' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.RBRACE, expectedLiteral: '}' },
    { expectedType: token.ELSE, expectedLiteral: 'else' },
    { expectedType: token.LBRACE, expectedLiteral: '{' },
    { expectedType: token.RETURN, expectedLiteral: 'return' },
    { expectedType: token.FALSE, expectedLiteral: 'false' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.RBRACE, expectedLiteral: '}' },
    { expectedType: token.EOF, expectedLiteral: '' },
  ];

  const l = new Lexer(input);

  tests.forEach((tt, i) => {
    const tok = l.nextToken();

    t.is(tt.expectedType, tok.Type, `tests[${i}] - tokentype wrong.`);
    t.is(tt.expectedLiteral, tok.Literal, `tests[${i}] - literal wrong.`);
  });

  t.pass();
});

test('test next token with two character operators', (t) => {
  const input: string = `
  10 == 10;
  10 != 9;
  `;
  const tests: Array<{
    expectedType: TokenType,
    expectedLiteral: string,
  }> = [
    { expectedType: token.INT, expectedLiteral: '10' },
    { expectedType: token.EQ, expectedLiteral: '==' },
    { expectedType: token.INT, expectedLiteral: '10' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.INT, expectedLiteral: '10' },
    { expectedType: token.NOT_EQ, expectedLiteral: '!=' },
    { expectedType: token.INT, expectedLiteral: '9' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.EOF, expectedLiteral: '' },
  ];

  const l = new Lexer(input);

  tests.forEach((tt, i) => {
    const tok = l.nextToken();

    t.is(tt.expectedType, tok.Type, `tests[${i}] - tokentype wrong.`);
    t.is(tt.expectedLiteral, tok.Literal, `tests[${i}] - literal wrong.`);
  });

  t.pass();
});

test('test next token strings', (t) => {
  const input: string = `
  "foobar"
  "foo bar"
  `;
  const tests: Array<{
    expectedType: TokenType,
    expectedLiteral: string,
  }> = [
    { expectedType: token.STRING, expectedLiteral: 'foobar' },
    { expectedType: token.STRING, expectedLiteral: 'foo bar' },
    { expectedType: token.EOF, expectedLiteral: '' },
  ];

  const l = new Lexer(input);

  tests.forEach((tt, i) => {
    const tok = l.nextToken();

    t.is(tt.expectedType, tok.Type, `tests[${i}] - tokentype wrong.`);
    t.is(tt.expectedLiteral, tok.Literal, `tests[${i}] - literal wrong.`);
  });

  t.pass();
});

test('array', (t) => {
  const input: string = '[1, 2];';
  const tests: Array<{
    expectedType: TokenType,
    expectedLiteral: string,
  }> = [
    { expectedType: token.LBRACKET, expectedLiteral: '[' },
    { expectedType: token.INT, expectedLiteral: '1' },
    { expectedType: token.COMMA, expectedLiteral: ',' },
    { expectedType: token.INT, expectedLiteral: '2' },
    { expectedType: token.RBRACKET, expectedLiteral: ']' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.EOF, expectedLiteral: '' },
  ];

  const l = new Lexer(input);

  tests.forEach((tt, i) => {
    const tok = l.nextToken();

    t.is(tt.expectedType, tok.Type, `tests[${i}] - tokentype wrong.`);
    t.is(tt.expectedLiteral, tok.Literal, `tests[${i}] - literal wrong.`);
  });

  t.pass();
});

test('hash', (t) => {
  const input: string = '{"foo": "bar"}';
  const tests: Array<{
    expectedType: TokenType,
    expectedLiteral: string,
  }> = [
    { expectedType: token.LBRACE, expectedLiteral: '{' },
    { expectedType: token.STRING, expectedLiteral: 'foo' },
    { expectedType: token.COLON, expectedLiteral: ':' },
    { expectedType: token.STRING, expectedLiteral: 'bar' },
    { expectedType: token.RBRACE, expectedLiteral: '}' },
    { expectedType: token.EOF, expectedLiteral: '' },
  ];

  const l = new Lexer(input);

  tests.forEach((tt, i) => {
    const tok = l.nextToken();

    t.is(tt.expectedType, tok.Type, `tests[${i}] - tokentype wrong.`);
    t.is(tt.expectedLiteral, tok.Literal, `tests[${i}] - literal wrong.`);
  });

  t.pass();
});
