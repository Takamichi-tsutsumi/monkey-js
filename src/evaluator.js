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

function evalBangOperatorExpression(right: object.Obj): object.Obj {
  switch (right) {
    case TRUE:
      return FALSE;
    case FALSE:
      return TRUE;
    case NULL:
      return TRUE;
    default:
      return FALSE;
  }
}

function evalMinusPrefixOperatorExpression(right: object.Obj): object.Obj {
  if (right.Type() !== object.INTEGER_OBJ) {
    return NULL;
  }

  const value: number = right.Value;
  return new object.Integer(-value);
}

function evaluPrefixExpression(operator: string, right: object.Obj): object.Obj {
  switch (operator) {
    case '!':
      return evalBangOperatorExpression(right);
    case '-':
      return evalMinusPrefixOperatorExpression(right);
    default:
      return NULL;
  }
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
    case ast.PrefixExpression:
      const right: object.Obj = Eval(node.Right);
      return evaluPrefixExpression(node.Operator, right);
    default:
      return null;
  }
}
