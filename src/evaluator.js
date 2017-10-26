// @flow
import * as ast from './ast';
import * as object from './object';

// define as const
const NULL = new object.Null();
const TRUE = new object.Boolean(true);
const FALSE = new object.Boolean(false);

function evalStatements(stmts: Array<ast.Statement>): object.Obj {
  let result: object.Obj;

  stmts.forEach((stmt) => {
    result = Eval(stmt);
  });

  return result;
}

function nativeBoolToBooleanObject(input: boolean): object.Boolean {
  if (input) return TRUE;
  return FALSE;
}

export default function Eval(node: ast.Node): ?object.Obj {
  switch (node.constructor) {
    // Evaluate Statements
    case ast.Program:
      return evalStatements(node.Statements);
    case ast.ExpressionStatement:
      return Eval(node.Expression);

    // Evaluate Expressions
    case ast.IntegerLiteral:
      return new object.Integer(node.Value);
    case ast.Boolean:
      return nativeBoolToBooleanObject(node.Value);
    default:
      return null;
  }
}
