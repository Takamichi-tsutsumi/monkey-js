// @flow
import * as ast from './ast';
import * as object from './object';

// define as const
export const NULL = new object.Null();
export const TRUE = new object.Boolean(true);
export const FALSE = new object.Boolean(false);

function evalStatements(stmts: Array<ast.Statement>): ?object.Obj {
  let result: ?object.Obj;

  stmts.forEach((stmt) => {
    result = Eval(stmt);
  });

  return result;
}

function nativeBoolToBooleanObject(input: boolean): object.Boolean {
  if (input) return TRUE;
  return FALSE;
}

function evalBangOperatorExpression(right: ?object.Obj): object.Obj {
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

function evalMinusPrefixOperatorExpression(right: ?object.Obj): object.Obj {
  if (!right) return NULL;

  if (right.Type() !== object.INTEGER_OBJ) {
    return NULL;
  }

  const value: number = ((right: any): object.Integer).Value;
  return new object.Integer(-value);
}

function evaluPrefixExpression(operator: string, right: ?object.Obj): object.Obj {
  switch (operator) {
    case '!':
      return evalBangOperatorExpression(right);
    case '-':
      return evalMinusPrefixOperatorExpression(right);
    default:
      return NULL;
  }
}

function evalIntegerInfixExpression(
  operator: string,
  left: object.Integer,
  right: object.Integer,
): object.Obj {
  const leftVal: number = left.Value;
  const rightVal: number = right.Value;

  switch (operator) {
    case '+':
      return new object.Integer(leftVal + rightVal);
    case '-':
      return new object.Integer(leftVal - rightVal);
    case '*':
      return new object.Integer(leftVal * rightVal);
    case '/':
      return new object.Integer(leftVal / rightVal);
    case '<':
      return nativeBoolToBooleanObject(leftVal < rightVal);
    case '>':
      return nativeBoolToBooleanObject(leftVal > rightVal);
    case '==':
      return nativeBoolToBooleanObject(leftVal === rightVal);
    case '!=':
      return nativeBoolToBooleanObject(leftVal !== rightVal);
    default:
      return NULL;
  }
}

function evalInfixExpression(operator: string, left: ?object.Obj, right: ?object.Obj): object.Obj {
  if (!left || !right) return NULL;

  if (left.Type() === object.INTEGER_OBJ && right.Type() === object.INTEGER_OBJ) {
    return evalIntegerInfixExpression(
      operator,
      ((left: any): object.Integer),
      ((right: any): object.Integer),
    );
  }
  if (operator === '==') return nativeBoolToBooleanObject(left === right);
  if (operator === '!=') return nativeBoolToBooleanObject(left !== right);

  return NULL;
}

function isTruthy(obj: object.Obj): boolean {
  switch (obj) {
    case NULL:
      return false;
    case TRUE:
      return true;
    case FALSE:
      return false;
    default:
      return true;
  }
}

function evalIfExpression(ie: ast.IfExpression): object.Obj {
  const condition: object.Obj = Eval(ie.Condition);

  if (isTruthy(condition)) {
    return Eval(ie.Consequence);
  } else if (ie.Alternative) {
    return Eval(ie.Alternative);
  }

  return NULL;
}

export default function Eval(node: ast.Node): ?object.Obj {
  let right;
  let left;
  let castedNode;

  switch (node.constructor) {
    // Evaluate Statements
    case ast.Program:
      castedNode = ((node: any): ast.Program);
      return evalStatements(castedNode.Statements);
    case ast.ExpressionStatement:
      castedNode = ((node: any): ast.ExpressionStatement);
      return Eval(castedNode.Expression);

    // Evaluate Expressions
    case ast.IntegerLiteral:
      castedNode = ((node: any): ast.IntegerLiteral);
      return new object.Integer(castedNode.Value);
    case ast.Boolean:
      castedNode = ((node: any): ast.Boolean);
      return nativeBoolToBooleanObject(castedNode.Value);
    case ast.PrefixExpression:
      castedNode = ((node: any): ast.PrefixExpression);
      right = Eval(castedNode.Right);
      return evaluPrefixExpression(castedNode.Operator, right);
    case ast.InfixExpression:
      castedNode = ((node: any): ast.InfixExpression);
      left = Eval(castedNode.Left);
      right = Eval(castedNode.Right);
      return evalInfixExpression(castedNode.Operator, left, right);
    case ast.BlockStatement:
      castedNode = ((node: any): ast.BlockStatement);
      return evalStatements(castedNode.Statements);
    case ast.IfExpression:
      castedNode = ((node: any): ast.IfExpression);
      return evalIfExpression(castedNode);
    default:
      return null;
  }
}
