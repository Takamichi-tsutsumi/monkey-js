// @flow
import * as object from './object';
import * as evaluator from './evaluator';

const builtins = {
  len: new object.Builtin((...args: Array<object.Obj>): object.Obj => {
    if (args.length !== 1) {
      return new object.Error(`wrong number of arguments. got=${args.length}, want=1`);
    }

    switch (args[0].constructor) {
      case object.String:
        return new object.Integer(args[0].Value.length);
      case object.Array:
        return new object.Integer(args[0].Elements.length);
      default:
        return new object.Error(`argument to \`len\` not supported, got ${args[0].Type()}`);
    }
  }),
  first: new object.Builtin((...args: Array<object.Obj>): object.Obj => {
    if (args.length !== 1) {
      return new object.Error(`wrong number of arguments. got=${args.length}, want=1`);
    }
    if (args[0].Type() !== object.ARRAY_OBJ) {
      return new object.Error(`argument to \`first\` must be ARRAY, ${args[0].Type()}`);
    }

    const arr: object.Array = ((args[0]: any): object.Array);
    if (arr.Elements.length > 0) {
      return arr.Elements[0];
    }
    return evaluator.NULL;
  }),
  last: new object.Builtin((...args: Array<object.Obj>): object.Obj => {
    if (args.length !== 1) {
      return new object.Error(`wrong number of arguments. got=${args.length}, want=1`);
    }
    if (args[0].Type() !== object.ARRAY_OBJ) {
      return new object.Error(`argument to \`last\` must be ARRAY, ${args[0].Type()}`);
    }

    const arr: object.Array = ((args[0]: any): object.Array);
    const length: number = arr.Elements.length;
    if (length > 0) {
      return arr.Elements[length - 1];
    }
    return evaluator.NULL;
  }),
  rest: new object.Builtin((...args: Array<object.Obj>): object.Obj => {
    if (args.length !== 1) {
      return new object.Error(`wrong number of arguments. got=${args.length}, want=1`);
    }
    if (args[0].Type() !== object.ARRAY_OBJ) {
      return new object.Error(`argument to \`last\` must be ARRAY, ${args[0].Type()}`);
    }

    const arr: object.Array = ((args[0]: any): object.Array);
    const length: number = arr.Elements.length;

    if (length > 0) {
      return new object.Array(arr.Elements.slice(1, length));
    }

    return evaluator.NULL;
  }),
  push: new object.Builtin((...args: Array<object.Obj>): object.Obj => {
    if (args.length !== 2) {
      return new object.Error(`wrong number of arguments. got=${args.length}, want=2`);
    }
    if (args[0].Type() !== object.ARRAY_OBJ) {
      return new object.Error(`argument to \`last\` must be ARRAY, ${args[0].Type()}`);
    }

    const arr: object.Array = ((args[0]: any): object.Array);

    return new object.Array([...arr.Elements, args[1]]);
  }),
};

export default builtins;
