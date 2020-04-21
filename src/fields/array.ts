import Field, { defaultOpts, FieldOptions } from "./base";
import { toType, MISSING, isArray } from "utils";
import { Schema, FieldObject } from "../schema";
import { FieldValidationError, ConfigurationError } from "errors";

export interface ArrayFieldOptions<F extends Field> extends FieldOptions {
  values: F;
}

export class ArrayField<V extends Field> extends Field<
  Array<V>,
  ArrayFieldOptions<V>
> {
  defaultOpts() {
    return {
      ...defaultOpts,
      required: false,
      values: (null as unknown) as V,
    };
  }

  initialize() {
    if (this.opts.values === null) {
      throw new ConfigurationError(
        "Must set a values option for an array field"
      );
    }
    this.addErrorMessages({
      invalid: "Not a valid array",
    });
  }

  _serialize(value: any, params: any) {
    if (!isArray(value)) {
      this.error("invalid");
    }
    return value.map((subvalue: any, index: number) =>
      this.opts.values.serialize({ obj: value, attr: index })
    );
  }
  _deserialize(value: any, params: any) {
    if (!isArray(value)) {
      this.error("invalid");
    }
    return value.map((subvalue: any, index: number) =>
      this.opts.values.deserialize({ data: value, attr: index })
    );
  }
}

export default <V extends Field>(opts: Partial<ArrayFieldOptions<V>> = {}) =>
  new ArrayField(opts);
