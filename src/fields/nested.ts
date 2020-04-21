import Field, { defaultOpts, FieldOptions } from "./base";
import { toType } from "utils";
import { Schema, FieldObject } from "../schema";
import { ConfigurationError } from "errors";

export interface NestedFieldOptions<S> extends FieldOptions {
  schema: S;
}

export class Nested<F extends FieldObject, A extends Record<string, string>, D extends Record<string, string>, S extends Schema<F, D, D>> extends Field<ReturnType<S["load"]>, NestedFieldOptions<S>> {
  defaultOpts() {
    return {
      ...defaultOpts,
      schema: (null as unknown) as S,
    }
  }
  initialize() {
    if (this.opts.schema === null) {
      throw new ConfigurationError("Schema on nested field must not be null");
    }
    this._continueOnMissing = true;
  }
  _serialize(value: any, params: any) {
    return this.opts.schema.dump(value);
  }
  _deserialize(value: any, params: any) {
    return this.opts.schema.load(value) as ReturnType<S["load"]>;
  }
}

export default <F extends FieldObject, A extends Record<string, string>, D extends Record<string, string>, S extends Schema<F, D, D>>(opts: Partial<NestedFieldOptions<S>> = {}) => new Nested(opts);
