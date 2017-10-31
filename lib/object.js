'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Func = exports.Error = exports.ReturnValue = exports.Null = exports.Boolean = exports.Integer = exports.FUNCTION_OBJ = exports.ERROR_OBJ = exports.RETURN_VALUE_OBJ = exports.NULL_OBJ = exports.BOOLEAN_OBJ = exports.INTEGER_OBJ = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ast = require('./ast');

var ast = _interopRequireWildcard(_ast);

var _environment = require('./environment');

var _environment2 = _interopRequireDefault(_environment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var INTEGER_OBJ = exports.INTEGER_OBJ = 'INTEGER';
var BOOLEAN_OBJ = exports.BOOLEAN_OBJ = 'BOOLEAN';
var NULL_OBJ = exports.NULL_OBJ = 'NULL';
var RETURN_VALUE_OBJ = exports.RETURN_VALUE_OBJ = 'RETURN_VALUE';
var ERROR_OBJ = exports.ERROR_OBJ = 'ERROR';
var FUNCTION_OBJ = exports.FUNCTION_OBJ = 'FUNCTION';

var Integer = exports.Integer = function () {
  function Integer(val) {
    _classCallCheck(this, Integer);

    this.Value = val;
  }

  _createClass(Integer, [{
    key: 'Type',
    value: function Type() {
      return INTEGER_OBJ;
    }
  }, {
    key: 'Inspect',
    value: function Inspect() {
      return '' + this.Value.toString();
    }
  }]);

  return Integer;
}();

var Boolean = exports.Boolean = function () {
  function Boolean(val) {
    _classCallCheck(this, Boolean);

    this.Value = val;
  }

  _createClass(Boolean, [{
    key: 'Type',
    value: function Type() {
      return BOOLEAN_OBJ;
    }
  }, {
    key: 'Inspect',
    value: function Inspect() {
      return '' + this.Value.toString();
    }
  }]);

  return Boolean;
}();

var Null = exports.Null = function () {
  function Null() {
    _classCallCheck(this, Null);
  }

  _createClass(Null, [{
    key: 'Type',
    value: function Type() {
      return NULL_OBJ;
    }
  }, {
    key: 'Inspect',
    value: function Inspect() {
      return 'null';
    }
  }]);

  return Null;
}();

var ReturnValue = exports.ReturnValue = function () {
  function ReturnValue(val) {
    _classCallCheck(this, ReturnValue);

    this.Value = val;
  }

  _createClass(ReturnValue, [{
    key: 'Type',
    value: function Type() {
      return RETURN_VALUE_OBJ;
    }
  }, {
    key: 'Inspect',
    value: function Inspect() {
      return this.Value.Inspect();
    }
  }]);

  return ReturnValue;
}();

var Error = exports.Error = function () {
  function Error(message) {
    _classCallCheck(this, Error);

    this.Message = message;
  }

  _createClass(Error, [{
    key: 'Type',
    value: function Type() {
      return ERROR_OBJ;
    }
  }, {
    key: 'Inspect',
    value: function Inspect() {
      return 'ERROR: ' + this.Message;
    }
  }]);

  return Error;
}();

var Func = exports.Func = function () {
  function Func(params, body, env) {
    _classCallCheck(this, Func);

    this.Parameters = params;
    this.Body = body;
    this.Env = env;
  }

  _createClass(Func, [{
    key: 'Type',
    value: function Type() {
      return FUNCTION_OBJ;
    }
  }, {
    key: 'Inspect',
    value: function Inspect() {
      return 'fn(' + this.Parameters.map(function (p) {
        return p.toString();
      }).join(', ') + ') {\n' + this.Body.toString() + '\n}';
    }
  }]);

  return Func;
}();