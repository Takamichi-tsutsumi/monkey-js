'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _object = require('./object');

var object = _interopRequireWildcard(_object);

var _evaluator = require('./evaluator');

var evaluator = _interopRequireWildcard(_evaluator);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var builtins = {
  len: new object.Builtin(function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length !== 1) {
      return new object.Error('wrong number of arguments. got=' + args.length + ', want=1');
    }

    switch (args[0].constructor) {
      case object.String:
        return new object.Integer(args[0].Value.length);
      case object.Array:
        return new object.Integer(args[0].Elements.length);
      default:
        return new object.Error('argument to `len` not supported, got ' + args[0].Type());
    }
  }),
  first: new object.Builtin(function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (args.length !== 1) {
      return new object.Error('wrong number of arguments. got=' + args.length + ', want=1');
    }
    if (args[0].Type() !== object.ARRAY_OBJ) {
      return new object.Error('argument to `first` must be ARRAY, ' + args[0].Type());
    }

    var arr = args[0];
    if (arr.Elements.length > 0) {
      return arr.Elements[0];
    }
    return evaluator.NULL;
  }),
  last: new object.Builtin(function () {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    if (args.length !== 1) {
      return new object.Error('wrong number of arguments. got=' + args.length + ', want=1');
    }
    if (args[0].Type() !== object.ARRAY_OBJ) {
      return new object.Error('argument to `last` must be ARRAY, ' + args[0].Type());
    }

    var arr = args[0];
    var length = arr.Elements.length;
    if (length > 0) {
      return arr.Elements[length - 1];
    }
    return evaluator.NULL;
  }),
  rest: new object.Builtin(function () {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    if (args.length !== 1) {
      return new object.Error('wrong number of arguments. got=' + args.length + ', want=1');
    }
    if (args[0].Type() !== object.ARRAY_OBJ) {
      return new object.Error('argument to `last` must be ARRAY, ' + args[0].Type());
    }

    var arr = args[0];
    var length = arr.Elements.length;

    if (length > 0) {
      return new object.Array(arr.Elements.slice(1, length));
    }

    return evaluator.NULL;
  }),
  push: new object.Builtin(function () {
    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    if (args.length !== 2) {
      return new object.Error('wrong number of arguments. got=' + args.length + ', want=2');
    }
    if (args[0].Type() !== object.ARRAY_OBJ) {
      return new object.Error('argument to `last` must be ARRAY, ' + args[0].Type());
    }

    var arr = args[0];

    return new object.Array([].concat(_toConsumableArray(arr.Elements), [args[1]]));
  })
};

exports.default = builtins;