import Field, { defaultOpts, FieldOptions } from "./base";
import { toType } from "utils";

const numberRegEx = new RegExp(/^-?\d*\.?\d*$/);

export interface NumberFieldOptions extends FieldOptions {
  strict?: boolean;
}

export class NumberField extends Field<number, NumberFieldOptions> {
  defaultOpts() {
    return {
      ...defaultOpts,
      strict: false,
    };
  }
  initialize() {
    this.addErrorMessages({
      invalid: "Not a valid number",
    });
  }

  coerceToNumber(value: any) {
    if (toType(value) === "string") {
      if (numberRegEx.test(value)) {
        return Number(value);
      }
    }
    return value;
  }

  validateNumber(value: any) {
    if (toType(value) !== "number") {
      this.error("invalid");
    }
  }
  _serialize(value: any, params: any) {
    this.validateNumber(value);
    return value;
  }
  _deserialize(value: any, params: any) {
    if (!this.opts.strict) {
      value = this.coerceToNumber(value);
    }
    this.validateNumber(value);
    return value;
  }
}

export default (opts: NumberFieldOptions = {}) => new NumberField(opts);
