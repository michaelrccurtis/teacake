import Field, { defaultOpts, FieldOptions } from "./base";
import { toType } from "utils";

export interface BoolFieldOptions extends FieldOptions {
  strict: boolean;
  validTrueStrings: string[];
  validFalseStrings: string[];
}

export class BoolField extends Field<boolean, BoolFieldOptions> {
  defaultOpts() {
    return {
      ...defaultOpts,
      strict: false,
      validTrueStrings: ['true'],
      validFalseStrings: ['false']
    }
  }
  initialize() {
    this.addErrorMessages({
      invalid: "Not a valid bool.",
    })
  }

  coerceToBool(value: any) {
    if (toType(value) === "string") {
      if (this.opts.validTrueStrings.includes(value)){
        return true;
      }
      if (this.opts.validFalseStrings.includes(value)){
        return false;
      }
    }
    return value;
  }

  validateBool(value: any) {
    if (toType(value) !== "boolean") {
      this.error('invalid');
    }
  }
  _serialize(value: any, params: any) {
    this.validateBool(value);
    return value;
  }
  _deserialize(value: any, params: any) {
    if (!this.opts.strict) {
      value = this.coerceToBool(value);
    }
    this.validateBool(value);
    return value;
  }
}

export default (opts: Partial<BoolFieldOptions> = {}) => new BoolField(opts);
