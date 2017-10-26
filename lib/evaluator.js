'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Eval;

var _ast = require('./ast');

var ast = _interopRequireWildcard(_ast);

var _object = require('./object');

var object = _interopRequireWildcard(_object);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// define as const
var NULL = new object.Null();
var TRUE = new object.Boolean(true);
var FALSE = new object.Boolean(false);

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
  if (left.Type() === object.INTEGER_OBJ && right.Type() === object.INTEGER_OBJ) {
    return evalIntegerInfixExpression(operator, left, right);
  }
  if (operator === '==') return nativeBoolToBooleanObject(left === right);
  if (operator === '!=') return nativeBoolToBooleanObject(left !== right);

  return NULL;
}

function Eval(node) {
  var right = void 0;
  var left = void 0;

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
      right = Eval(node.Right);
      return evaluPrefixExpression(node.Operator, right);
    case ast.InfixExpression:
      left = Eval(node.Left);
      right = Eval(node.Right);
      return evalInfixExpression(node.Operator, left, right);
    default:
      return null;
  }
}