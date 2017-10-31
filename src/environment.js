// @flow
import * as object from './object';

export default class Environment {
  store: Map<string, object.Obj>;
  outer: ?Environment;

  constructor(store: Map<string, object.Obj>, outer: ?Environment) {
    this.store = store;
    this.outer = outer;
  }

  Get(name: string): ?object.Obj {
    const obj: ?object.Obj = this.store.get(name);
    if (!obj && this.outer) return this.outer.Get(name);

    return obj;
  }

  Set(name: string, val: object.Obj): object.Obj {
    this.store.set(name, val);
    return val;
  }
}
