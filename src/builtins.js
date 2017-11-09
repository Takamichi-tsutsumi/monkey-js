// @flow
import * as object from './object';

const builtins = {
  len: new object.Builtin((...args: Array<object.Obj>): object.Obj => {
    if (args.length !== 1) {
      return new object.Error(`wrong number of arguments. got=${args.length}, want=1`);
    }

    switch (args[0].constructor) {
      case object.String:
        return new object.Integer(args[0].Value.length);
      default:
        return new object.Error(`argument to \`len\` not supported, got ${args[0].Type()}`);
    }
  }),
};

export default builtins;
