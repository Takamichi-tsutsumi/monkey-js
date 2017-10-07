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
    { expectedType: token.LPARE, expectedLiteral: '(' },
    { expectedType: token.RPARE, expectedLiteral: ')' },
    { expectedType: token.LBRAC, expectedLiteral: '{' },
    { expectedType: token.RBRAC, expectedLiteral: '}' },
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
    { expectedType: token.LPARE, expectedLiteral: '(' },
    { expectedType: token.IDENT, expectedLiteral: 'x' },
    { expectedType: token.COMMA, expectedLiteral: ',' },
    { expectedType: token.IDENT, expectedLiteral: 'y' },
    { expectedType: token.RPARE, expectedLiteral: ')' },
    { expectedType: token.LBRAC, expectedLiteral: '{' },
    { expectedType: token.IDENT, expectedLiteral: 'x' },
    { expectedType: token.PLUS, expectedLiteral: '+' },
    { expectedType: token.IDENT, expectedLiteral: 'y' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.RBRAC, expectedLiteral: '}' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.LET, expectedLiteral: 'let' },
    { expectedType: token.IDENT, expectedLiteral: 'result' },
    { expectedType: token.ASSIGN, expectedLiteral: '=' },
    { expectedType: token.IDENT, expectedLiteral: 'add' },
    { expectedType: token.LPARE, expectedLiteral: '(' },
    { expectedType: token.IDENT, expectedLiteral: 'five' },
    { expectedType: token.COMMA, expectedLiteral: ',' },
    { expectedType: token.IDENT, expectedLiteral: 'ten' },
    { expectedType: token.RPARE, expectedLiteral: ')' },
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
