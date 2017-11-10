// @flow
import test from 'ava';
import * as object from '../src/object';

test('string hash key', (t) => {
  const hello1: object.String = new object.String('Hello World');
  const hello2: object.String = new object.String('Hello World');
  const diff1: object.String = new object.String('My name is johnny');
  const diff2: object.String = new object.String('My name is johnny');

  t.is(hello1.HashKey(), hello2.HashKey());
  t.is(diff1.HashKey(), diff2.HashKey());
  t.not(hello1.HashKey(), diff1.HashKey());

  t.pass();
});
