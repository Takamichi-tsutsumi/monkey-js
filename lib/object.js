'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var INTEGER_OBJ = 'INTEGER';

var BOOLEAN_OBJ = 'BOOLEAN';
var NULL_OBJ = 'NULL';

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
  function Boolean() {
    _classCallCheck(this, Boolean);
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