'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _object = require('./object');

var object = _interopRequireWildcard(_object);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
      default:
        return new object.Error('argument to `len` not supported, got ' + args[0].Type());
    }
  })
};
exports.default = builtins;