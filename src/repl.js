// @flow
import readline from 'readline';
import Lexer from './lexer';
import type { Token } from './token';
import * as token from './token';

const printToken = (out: stream$Writable, tok: Token): void => {
  out.write(`{ Type: ${tok.Type}, Literal: ${tok.Literal} }\n`);
};

const PROMPT: string = '>> ';

export const Start = (input: stream$Readable, output: stream$Writable): void => {
  const rl = readline.createInterface({
    input,
    output,
  });

  output.write(PROMPT);
  rl.on('line', (line) => {
    const l: Lexer = new Lexer(line);
    let tok: Token = l.nextToken();

    while (tok.Type !== token.EOF) {
      printToken(output, tok);
      tok = l.nextToken();
    }
    output.write(PROMPT);
  });
};
