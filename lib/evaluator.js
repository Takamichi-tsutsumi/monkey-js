'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FALSE = exports.TRUE = exports.NULL = undefined;
exports.default = Eval;

var _ast = require('./ast');

var ast = _interopRequireWildcard(_ast);

var _object = require('./object');

var object = _interopRequireWildcard(_object);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// define as const
var NULL = exports.NULL = new object.Null();
var TRUE = exports.TRUE = new object.Boolean(true);
var FALSE = exports.FALSE = new object.Boolean(false);

function evalStatements(stmts) {
  var result = void 0;

  stmts.forEach(function (stmt) {
    result = Eval(stmt);
  });

  return result;
}

function nativeBoolToBooleanObject(input) {
  if (input) return TRUE;
  return FALSE;
}

function evalBangOperatorExpression(right) {
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

function evalMinusPrefixOperatorExpression(right) {
  if (!right) return NULL;

  if (right.Type() !== object.INTEGER_OBJ) {
    return NULL;
  }

  var value = right.Value;
  return new object.Integer(-value);
}

function evaluPrefixExpression(operator, right) {
  switch (operator) {
    case '!':
      return evalBangOperatorExpression(right);
    case '-':
      return evalMinusPrefixOperatorExpression(right);
    default:
      return NULL;
  }
}

function evalIntegerInfixExpression(operator, left, right) {
  var leftVal = left.Value;
  var rightVal = right.Value;

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

function evalInfixExpression(operator, left, right) {
  if (!left || !right) return NULL;

  if (left.Type() === object.INTEGER_OBJ && right.Type() === object.INTEGER_OBJ) {
    return evalIntegerInfixExpression(operator, left, right);
  }
  if (operator === '==') return nativeBoolToBooleanObject(left === right);
  if (operator === '!=') return nativeBoolToBooleanObject(left !== right);

  return NULL;
}

function isTruthy(obj) {
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

function evalIfExpression(ie) {
  var condition = Eval(ie.Condition);

  if (isTruthy(condition)) {
    return Eval(ie.Consequence);
  } else if (ie.Alternative) {
    return Eval(ie.Alternative);
  }

  return NULL;
}

function Eval(node) {
  var right = void 0;
  var left = void 0;
  var castedNode = void 0;

  switch (node.constructor) {
    // Evaluate Statements
    case ast.Program:
      castedNode = node;
      return evalStatements(castedNode.Statements);
    case ast.ExpressionStatement:
      castedNode = node;
      return Eval(castedNode.Expression);

    // Evaluate Expressions
    case ast.IntegerLiteral:
      castedNode = node;
      return new object.Integer(castedNode.Value);
    case ast.Boolean:
      castedNode = node;
      return nativeBoolToBooleanObject(castedNode.Value);
    case ast.PrefixExpression:
      castedNode = node;
      right = Eval(castedNode.Right);
      return evaluPrefixExpression(castedNode.Operator, right);
    case ast.InfixExpression:
      castedNode = node;
      left = Eval(castedNode.Left);
      right = Eval(castedNode.Right);
      return evalInfixExpression(castedNode.Operator, left, right);
    case ast.BlockStatement:
      castedNode = node;
      return evalStatements(castedNode.Statements);
    case ast.IfExpression:
      castedNode = node;
      return evalIfExpression(castedNode);
    default:
      return null;
  }
}