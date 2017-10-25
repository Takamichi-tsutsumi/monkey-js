/* @flow */
import Start from './repl';

(function main() {
  const username = process.env.USER;
  if (!username) {
    throw new Error('Invalid process. User not found');
  }

  process.stdout.write(`Hello ${username}! This is the Monkey programming language!\n`);
  process.stdout.write('Feel free to type in commands\n');
  Start(process.stdin, process.stdout);
}());
