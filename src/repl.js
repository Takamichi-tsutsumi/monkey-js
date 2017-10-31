// @flow
import readline from 'readline';
import Lexer from './lexer';
import Parser from './parser';
import type { Token } from './token';
import * as token from './token';
import * as ast from './ast';
import * as object from './object';
import Environment from './environment';
import Eval from './evaluator';

const printToken = (out: stream$Writable, tok: Token): void => {
  out.write(`{ Type: ${tok.Type}, Literal: ${tok.Literal} }\n`);
};

const PROMPT: string = '>> ';

const printParserError = (output: stream$Writable, errors: Array<string>) => {
  errors.forEach((err) => {
    output.write(`\t${err}\n`);
  });
};

const Start = (input: stream$Readable, output: stream$Writable): void => {
  const rl = readline.createInterface({
    input,
    output,
  });
  const env: Environment = new Environment(new Map(), null);

  output.write(PROMPT);
  rl.on('line', (line) => {
    const l: Lexer = new Lexer(line);
    const p: Parser = new Parser(l);

    const program: ast.Program = p.ParseProgram();
    if (p.Errors().length !== 0) {
      printParserError(output, p.Errors());
      output.write(PROMPT);
      return;
    }

    const evaluated: object.Obj = Eval(program, env);
    if (evaluated) {
      output.write(evaluated.Inspect());
    }

    output.write('\n');
    output.write(PROMPT);
  });
};

export default Start;
