// @flow
import hash from 'fnv1a';
import * as ast from './ast';
import Environment from './environment';

export type ObjType = string;

export const INTEGER_OBJ = 'INTEGER';
export const BOOLEAN_OBJ = 'BOOLEAN';
export const NULL_OBJ = 'NULL';
export const RETURN_VALUE_OBJ = 'RETURN_VALUE';
export const ERROR_OBJ = 'ERROR';
export const FUNCTION_OBJ = 'FUNCTION';
export const STRING_OBJ = 'STRING';
export const BUILTIN_OBJ = 'BUILTIN';
export const ARRAY_OBJ = 'ARRAY';
export const HASH_OBJ = 'HASH';

export interface Obj {
  Type(): ObjType;
  Inspect(): string;
}

type HashKey = string;

export interface Hashable {
  HashKey(): HashKey;
}

export class Integer implements Obj {
  Value: number;

  constructor(val: number): void {
    this.Value = val;
  }

  Type(): ObjType {
    return INTEGER_OBJ;
  }

  Inspect(): string {
    return `${this.Value.toString()}`;
  }

  HashKey(): HashKey {
    return `${this.Type()},${this.Value}`;
  }
}

export class Boolean implements Obj {
  Value: boolean;

  constructor(val: boolean): void {
    this.Value = val;
  }

  Type(): ObjType {
    return BOOLEAN_OBJ;
  }

  Inspect(): string {
    return `${this.Value.toString()}`;
  }

  HashKey(): HashKey {
    let value: number;
    if (this.Value) {
      value = 1;
    } else {
      value = 0;
    }

    return `${this.Type()},${value}`;
  }
}

export class Null implements Obj {
  Type(): ObjType {
    return NULL_OBJ;
  }

  Inspect(): string {
    return 'null';
  }
}

export class ReturnValue implements Obj {
  Value: Obj;

  constructor(val: Obj): void {
    this.Value = val;
  }

  Type(): ObjType {
    return RETURN_VALUE_OBJ;
  }

  Inspect(): string {
    return this.Value.Inspect();
  }
}

export class Error implements Obj {
  Message: string;

  constructor(message: string): void {
    this.Message = message;
  }

  Type(): ObjType {
    return ERROR_OBJ;
  }

  Inspect(): string {
    return `ERROR: ${this.Message}`;
  }
}

export class Func implements Obj {
  Parameters: Array<ast.Identifier>;
  Body: ast.BlockStatement;
  Env: Environment;

  constructor(params: Array<ast.Identifier>, body: ast.BlockStatement, env: Environment): void {
    this.Parameters = params;
    this.Body = body;
    this.Env = env;
  }

  Type(): ObjType {
    return FUNCTION_OBJ;
  }

  Inspect(): string {
    return `fn(${this.Parameters.map(p => p.toString()).join(', ')}) {\n${this.Body.toString()}\n}`;
  }
}

export class String implements Obj {
  Value: string;

  constructor(val: string): void {
    this.Value = val;
  }

  Type(): ObjType {
    return STRING_OBJ;
  }

  Inspect(): string {
    return `${this.Value}`;
  }

  HashKey(): HashKey {
    const h: numaber = hash(this.Value);

    return `${this.Type()},${h}`;
  }
}

type BuiltinFunction = (...args: Array<object.Obj>) => object.Obj;

export class Builtin implements Obj {
  Fn: BuiltinFunction;
  constructor(fn: BuiltinFunction): void {
    this.Fn = fn;
  }

  Type(): ObjType {
    return BUILTIN_OBJ;
  }

  Inspect(): string {
    return 'builtin function';
  }
}

export class Array implements Obj {
  Elements: Array<Obj>;

  constructor(elements: Array<Obj>) {
    this.Elements = elements;
  }

  Type(): ObjType {
    return ARRAY_OBJ;
  }

  Inspect(): string {
    return `[${this.Elements.map(elem => elem.Inspect()).join(', ')}]`;
  }
}

export class HashPair {
  Key: Object;
  Value: Object;

  constructor(k: Object, v: Object): void {
    this.Key = k;
    this.Value = v;
  }
}

export class Hash {
  Pairs: Map<HashKey, HashPair>;

  constructor(pairs: Map<HashKey, HashPair>): void {
    this.Pairs = pairs;
  }

  Type(): ObjType {
    return HASH_OBJ;
  }

  Inspect(): string {
    let str = '{';
    const arr = [];
    let key;
    for (key of this.Pairs.keys()) {
      const h: HashPair = this.Pairs.get(key);
      arr.push(`${h.Key.Inspect()}: ${h.Value.Inspect()}`);
    }

    str += arr.join(', ');
    str += '}';

    return str;
  }
}
