import Field, { defaultOpts, FieldOptions } from "./base";
import { toType } from "utils";

export class String extends Field<string> {
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

export default (opts: FieldOptions = {}) => new String(opts);
