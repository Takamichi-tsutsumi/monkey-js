// @flow

export type ObjType = string;

export const INTEGER_OBJ = 'INTEGER';
export const BOOLEAN_OBJ = 'BOOLEAN';
export const NULL_OBJ = 'NULL';
export const RETURN_VALUE_OBJ = 'RETURN_VALUE';
export const ERROR_OBJ = 'ERROR';

export interface Obj {
  Type(): ObjType;
  Inspect(): string;
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
