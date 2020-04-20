import Field, { defaultOpts, FieldOptions } from "./base";
import { toType } from "utils";
import { Schema } from "../schema";

export class Nested<F, A, D, S extends Schema<F, D, D>> extends Field<ReturnType<S["load"]>> {
  defaultOpts() {
    return defaultOpts
  }
  initialize() {
    this.addErrorMessages({
      invalid: "Not a valid string",
    })
  }

  validateString(value: any) {
    if (toType(value) !== "string") {
      this.error('invalid');
    }
  }
  _serialize(value: any, params: any) {
    this.validateString(value);
    return value;
  }
  _deserialize(value: any, params: any) {
    this.validateString(value);
    return value;
  }
}

export default (opts: Partial<FieldOptions> = {}) => new Nested(opts);
