import Field, { defaultOpts, FieldOptions } from "./base";
import { toType, MISSING } from "utils";
import { Schema, FieldObject } from "../schema";
import { FieldValidationError } from "errors";

export interface FunctionFieldOptions<T> extends FieldOptions {
  f: (value: any, obj: any) => T;
}

export class FunctionField<T> extends Field<T, FunctionFieldOptions<T>> {
  defaultOpts() {
    return {
      ...defaultOpts,
      required: false,
    }
  }

  initialize() {
    this._continueOnMissing = true;
  }

  _call(value: any, obj: any): T {
    try {
      return this.opts.f(value, obj);
    } catch (err) {
      throw new FieldValidationError(`Error when calling function: ${err}`);
    }
  }

  _serialize(value: any, params: any) {
    return this._call(value, params.obj);
  }
  _deserialize(value: any, params: any) {
    return this._call(value, params.data);
  }
}

export default <T>(opts: FunctionFieldOptions<T>) => new FunctionField(opts);
