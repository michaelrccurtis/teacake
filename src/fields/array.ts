import Field, { defaultOpts, FieldOptions } from "./base";
import { toType, MISSING, isArray } from "utils";
import { Schema, FieldObject } from "../schema";
import { FieldValidationError } from "errors";

export interface ArrayFieldOptions<F extends Field> extends FieldOptions {
  values: F;
}

export class ArrayField<V extends Field> extends Field<
  Array<ReturnType<V["deserialize"]>>,
  ArrayFieldOptions<V>
> {
  defaultOpts() {
    return {
      ...defaultOpts,
      required: false,
    };
  }

  initialize() {
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

export default <V extends Field>(opts: ArrayFieldOptions<V>) =>
  new ArrayField(opts);
