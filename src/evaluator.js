// @flow
import * as ast from './ast';
import * as object from './object';
import Environment from './environment';
import builtins from './builtins';

// define as const
export const NULL = new object.Null();
export const TRUE = new object.Boolean(true);
export const FALSE = new object.Boolean(false);

function evalProgram(program: ast.Program, env: Environment): ?object.Obj {
  let result: ?object.Obj;

  program.Statements.some((stmt) => {
    result = Eval(stmt, env);

    if (result) {
      switch (result.constructor) {
        case object.ReturnValue:
          result = ((result: any): object.ReturnValue).Value;
          return true;
        case object.Error:
          return true;
        default:
          return false;
      }
    }
  });

  return result;
}

function evalBlockStatement(block: ast.BlockStatement, env: Environment): ?object.Obj {
  let result: ?object.Obj;

  block.Statements.some((stmt) => {
    result = Eval(stmt, env);

    if (
      result &&
      (result.Type() === object.RETURN_VALUE_OBJ || result.Type() === object.ERROR_OBJ)
    ) {
      return true;
    }
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
  if (right.Type() !== object.INTEGER_OBJ) {
    return new object.Error(`unknown operator: -${right.Type()}`);
  }

  const value: number = ((right: any): object.Integer).Value;
  return new object.Integer(-value);
}

function evalPrefixExpression(operator: string, right: ?object.Obj): object.Obj {
  switch (operator) {
    case '!':
      return evalBangOperatorExpression(right);
    case '-':
      return evalMinusPrefixOperatorExpression(right);
    default:
      return new object.Error(`unknown operator: ${operator}${right.Type()}`);
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
      return new object.Error(`unknown operator: ${left.Type()} ${operator} ${right.Type()}`);
  }
}

function evalStringInfixExpression(
  operator: string,
  left: object.String,
  right: object.String,
): object.Obj {
  if (operator !== '+') {
    return new object.Error(`unknown operator: ${left.Type()} ${operator} ${right.Type()}`);
  }

  const leftVal: string = left.Value;
  const rightVal: string = right.Value;

  return new object.String(`${leftVal}${rightVal}`);
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

  if (left.Type() === object.STRING_OBJ && right.Type() === object.STRING_OBJ) {
    return evalStringInfixExpression(
      operator,
      ((left: any): object.String),
      ((right: any): object.String),
    );
  }

  if (left.Type() !== right.Type()) {
    return new object.Error(`type mismatch: ${left.Type()} ${operator} ${right.Type()}`);
  }

  return new object.Error(`unknown operator: ${left.Type()} ${operator} ${right.Type()}`);
}

function isTruthy(obj: ?object.Obj): boolean {
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

function evalIfExpression(ie: ast.IfExpression, env: Environment): ?object.Obj {
  const condition: ?object.Obj = Eval(ie.Condition, env);
  if (isError(condition)) {
    return condition;
  }

  if (isTruthy(condition)) {
    return Eval(ie.Consequence, env);
  } else if (ie.Alternative) {
    return Eval(ie.Alternative, env);
  }

  return NULL;
}

function evalIdentifier(node: ast.Identifier, env: Environment): ?object.Obj {
  const val: ?object.Obj = env.Get(node.Value);
  if (val) {
    return val;
  }

  const builtin: ?object.Obj = builtins[node.Value];
  if (builtin) {
    return builtin;
  }
  return new object.Error(`identifier not found: ${node.Value}`);
}

function isError(obj: object.Obj): boolean {
  if (obj) {
    return obj.Type() === object.ERROR_OBJ;
  }
  return false;
}

function evalExpressions(exps: Array<ast.Expression>, env: Environment): Array<object.Obj> {
  const result: Array<object.Obj> = [];

  exps.forEach((exp) => {
    const evaluated: ?object.Obj = Eval(exp, env);
    if (isError(evaluated)) return [exp];
    result.push(evaluated);
  });

  return result;
}

function extendFunctionEnv(fn: object.Func, args: Array<object.Obj>): Environment {
  const env: Environment = new Environment(new Map(), fn.Env);

  fn.Parameters.forEach((p, idx) => {
    env.Set(p.Value, args[idx]);
  });

  return env;
}

function unwrapReturnValue(obj: object.Obj): object.Obj {
  const returnValue = ((obj: any): object.ReturnValue);
  if (returnValue.constructor === object.ReturnValue) return returnValue.Value;

  return obj;
}

function applyFunction(fn: object.Obj, args: Array<object.Obj>): object.Obj {
  const func: object.Func = ((fn: any): object.Func);
  let extendedEnv;
  let evaluated;
  switch (func.constructor) {
    case object.Func:
      extendedEnv = extendFunctionEnv(func, args);
      evaluated = Eval(func.Body, extendedEnv);

      return unwrapReturnValue(evaluated);
    case object.Builtin:
      return func.Fn(...args);
    default:
      return new object.Error(`not a function: ${func.constructor}`);
  }
}

function evalArrayIndexExpression(array: ast.Expression, index: object.Obj): object.Obj {
  const arrayObject: object.Array = ((array: any): object.Array);
  const idx: number = ((index: any): object.Integer).Value;
  const max: number = arrayObject.Elements.length - 1;

  if (idx < 0 || idx > max) {
    return NULL;
  }

  return arrayObject.Elements[idx];
}

function evalHashIndexExpression(hash, index: object.Obj): object.Obj {
  const hashObject: object.Hash = ((hash: any): object.Hash);
  if (!index.HashKey) {
    return new object.Error(`unusable as hash key: ${index.Type()}`);
  }

  const pair: object.HashPair = hashObject.Pairs.get(index.HashKey());
  if (!pair) {
    return NULL;
  }

  return pair.Value;
}

function evalIndexExpression(left: ast.Expression, index: object.Obj): ?object.Obj {
  if (left.Type() === object.ARRAY_OBJ && index.Type() === object.INTEGER_OBJ) {
    return evalArrayIndexExpression(left, index);
  }
  if (left.Type() === object.HASH_OBJ) {
    return evalHashIndexExpression(left, index);
  }
  return new object.Error(`index operator not supported: ${left.Type()}`);
}

function evalHashLiteral(node: ast.HashLiteral, env: object.Environment): ?object.Obj {
  const pairs: Map<object.HashKey, object.HashPair> = new Map();

  let k;
  for (k of node.Pairs.keys()) {
    const key: object.Obj = Eval(k, env);
    if (isError(key)) {
      return key;
    }

    if (!key.HashKey) {
      return new object.Error(`unusable as hash key: ${key.Type()}`);
    }

    const value: object.Obj = Eval(node.Pairs.get(k), env);
    if (isError(value)) {
      return value;
    }

    const hashed: object.HashKey = key.HashKey();
    pairs.set(hashed, new object.HashPair(key, value));
  }

  return new object.Hash(pairs);
}

export default function Eval(node: ast.Node, env: Environment): ?object.Obj {
  let right;
  let left;
  let castedNode;
  let val;
  let params;
  let body;
  let func;
  let args;
  let elements;
  let index;

  switch (node.constructor) {
    // Evaluate Statements
    case ast.Program:
      castedNode = ((node: any): ast.Program);
      return evalProgram(castedNode, env);

    case ast.ExpressionStatement:
      castedNode = ((node: any): ast.ExpressionStatement);
      return Eval(castedNode.Expression, env);

    // Evaluate Expressions
    case ast.IntegerLiteral:
      castedNode = ((node: any): ast.IntegerLiteral);
      return new object.Integer(castedNode.Value);

    case ast.Boolean:
      castedNode = ((node: any): ast.Boolean);
      return nativeBoolToBooleanObject(castedNode.Value);

    case ast.PrefixExpression:
      castedNode = ((node: any): ast.PrefixExpression);
      right = Eval(castedNode.Right, env);
      if (isError(right)) {
        return right;
      }
      return evalPrefixExpression(castedNode.Operator, right);

    case ast.InfixExpression:
      castedNode = ((node: any): ast.InfixExpression);
      left = Eval(castedNode.Left, env);
      right = Eval(castedNode.Right, env);
      if (isError(left)) {
        return left;
      }
      if (isError(right)) {
        return right;
      }
      return evalInfixExpression(castedNode.Operator, left, right);

    case ast.BlockStatement:
      castedNode = ((node: any): ast.BlockStatement);
      return evalBlockStatement(castedNode, env);

    case ast.IfExpression:
      castedNode = ((node: any): ast.IfExpression);
      return evalIfExpression(castedNode, env);

    case ast.ReturnStatement:
      val = Eval(((node: any): ast.ReturnStatement).ReturnValue, env);
      if (isError(val)) {
        return val;
      }
      return new object.ReturnValue(val);

    case ast.LetStatement:
      val = Eval(((node: any): ast.LetStatement).Value, env);
      if (isError(val)) {
        return val;
      }
      env.Set(node.Name.Value, val);
      return null;

    case ast.Identifier:
      return evalIdentifier(node, env);

    case ast.FunctionLiteral:
      castedNode = ((node: any): ast.FunctionLiteral);
      params = node.Parameters;
      body = node.Body;
      return new object.Func(params, body, env);

    case ast.CallExpression:
      func = Eval(node.Func, env);
      if (isError(func)) return func;
      args = evalExpressions(node.Arguments, env);
      if (args.length === 1 && isError(args[0])) return args[0];

      return applyFunction(func, args);

    case ast.StringLiteral:
      return new object.String(node.Value);

    case ast.ArrayLiteral:
      elements = evalExpressions(node.Elements, env);
      if (elements.length === 1 && isError(elements[0])) {
        return elements[0];
      }

      return new object.Array(elements);

    case ast.IndexExpression:
      left = Eval(node.Left, env);
      if (isError(left)) {
        return left;
      }
      index = Eval(node.Index, env);
      if (isError(index)) {
        return index;
      }
      return evalIndexExpression(left, index);

    case ast.HashLiteral:
      return evalHashLiteral(node, env);

    default:
      return null;
  }
}
