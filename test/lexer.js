// @flow
import test from 'ava';
import * as tokens from '../src/token';

test('test next token', (t) => {
  const input = '=+(){},;';
  const tests = [
    [tokens.ASSIGN, '='],
    [tokens.PLUS, '+'],
    [tokens.LPARE, '('],
    [tokens.RPARE, ')'],
    [tokens.LBRAC, '{'],
    [tokens.RBRAC, '}'],
    [tokens.COMMA, ','],
    [tokens.SEMICOLON, ';'],
    [tokens.EOF, ''],
  ];

  t.pass();
});
