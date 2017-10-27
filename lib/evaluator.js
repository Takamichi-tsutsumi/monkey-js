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

function evalProgram(program) {
  var result = void 0;

  program.Statements.some(function (stmt) {
    result = Eval(stmt);

    if (result) {
      switch (result.constructor) {
        case object.ReturnValue:
          result = result.Value;
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

function evalBlockStatement(block) {
  var result = void 0;

  block.Statements.some(function (stmt) {
    result = Eval(stmt);

    if (result && (result.Type() === object.RETURN_VALUE_OBJ || result.Type() === object.ERROR_OBJ)) {
      return true;
    }
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
    return new object.Error('unknown operator: -' + right.Type());
  }

  var value = right.Value;
  return new object.Integer(-value);
}

function evalPrefixExpression(operator, right) {
  switch (operator) {
    case '!':
      return evalBangOperatorExpression(right);
    case '-':
      return evalMinusPrefixOperatorExpression(right);
    default:
      return new object.Error('unknown operator: ' + operator + right.Type());
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
      return new object.Error('unknown operator: ' + left.Type() + ' ' + operator + ' ' + right.Type());
  }
}

function evalInfixExpression(operator, left, right) {
  if (!left || !right) return NULL;

  if (left.Type() === object.INTEGER_OBJ && right.Type() === object.INTEGER_OBJ) {
    return evalIntegerInfixExpression(operator, left, right);
  }
  if (operator === '==') return nativeBoolToBooleanObject(left === right);
  if (operator === '!=') return nativeBoolToBooleanObject(left !== right);

  if (left.Type() !== right.Type()) {
    return new object.Error('type mismatch: ' + left.Type() + ' ' + operator + ' ' + right.Type());
  }

  return new object.Error('unknown operator: ' + left.Type() + ' ' + operator + ' ' + right.Type());
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
  if (isError(condition)) {
    return condition;
  }

  if (isTruthy(condition)) {
    return Eval(ie.Consequence);
  } else if (ie.Alternative) {
    return Eval(ie.Alternative);
  }

  return NULL;
}

function isError(obj) {
  if (obj) {
    return obj.Type() === object.ERROR_OBJ;
  }
  return false;
}

function Eval(node) {
  var right = void 0;
  var left = void 0;
  var castedNode = void 0;
  var val = void 0;

  switch (node.constructor) {
    // Evaluate Statements
    case ast.Program:
      castedNode = node;
      return evalProgram(castedNode);

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
      if (isError(right)) {
        return right;
      }
      return evalPrefixExpression(castedNode.Operator, right);

    case ast.InfixExpression:
      castedNode = node;
      left = Eval(castedNode.Left);
      right = Eval(castedNode.Right);
      if (isError(left)) {
        return left;
      }
      if (isError(right)) {
        return right;
      }
      return evalInfixExpression(castedNode.Operator, left, right);

    case ast.BlockStatement:
      castedNode = node;
      return evalBlockStatement(castedNode);

    case ast.IfExpression:
      castedNode = node;
      return evalIfExpression(castedNode);

    case ast.ReturnStatement:
      val = Eval(node.ReturnValue);
      if (isError(val)) {
        return val;
      }
      return new object.ReturnValue(val);

    default:
      return null;
  }
}