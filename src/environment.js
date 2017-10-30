// @flow
import * as object from './object';

export default class Environment {
  store: Map<string, object.Obj>;

  constructor() {
    this.store = new Map();
  }

  Get(name: string): ?object.Obj {
    return this.store.get(name);
  }

  Set(name: string, val: object.Obj): object.Obj {
    this.store.set(name, val);
    return val;
  }
}
