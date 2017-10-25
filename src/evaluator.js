// @flow
import * as ast from './ast';
import * as object from './object';

function evalStatements(stmts: Array<ast.Statement>): object.Obj {
  let result: object.Obj;

  stmts.forEach((stmt) => {
    result = Eval(stmt);
  });

  return result;
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
    default:
      return null;
  }
}
