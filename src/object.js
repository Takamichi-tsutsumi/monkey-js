// @flow

export type ObjType = string;

const INTEGER_OBJ = 'INTEGER';
const BOOLEAN_OBJ = 'BOOLEAN';
const NULL_OBJ = 'NULL';

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
