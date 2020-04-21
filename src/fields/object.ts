import Field, { defaultOpts, FieldOptions } from "./base";
import { toType, MISSING, isObject } from "utils";
import { Schema, FieldObject } from "../schema";
import { FieldValidationError, ConfigurationError } from "errors";

export interface ObjectFieldOptions<K extends Field, V extends Field> extends FieldOptions {
  keys: K;
  values: V;
}

export class ObjectField<K extends Field, V extends Field> extends Field<
  { [key: string]: V },
  ObjectFieldOptions<K, V>
> {
  defaultOpts() {
    return {
      ...defaultOpts,
      required: false,
    };
  }

  initialize() {
    this.addErrorMessages({
      invalid: "Not a valid object",
    });
  }

  _serialize(value: any, params: any) {
    if (!isObject(value)) {
      this.error("invalid");
    }
    return Object.keys(value).reduce((acc: any, _: any, index: number) => {
      const subKey = this.opts.keys.serialize({ obj: Object.keys(value), attr: index });
      const subValue = this.opts.values.serialize({ obj: Object.values(value), attr: index });
      acc[subKey] = subValue;
      return acc;
    }, {});
  }
  _deserialize(value: any, params: any) {
    if (!isObject(value)) {
      this.error("invalid");
    }
    return Object.keys(value).reduce((acc: any, _: any, index: number) => {
      const subKey = this.opts.keys.deserialize({ data: Object.keys(value), attr: index });
      const subValue = this.opts.values.deserialize({ data: Object.values(value), attr: index });
      acc[subKey] = subValue;
      return acc;
    }, {});
  }
}

export default <K extends Field, V extends Field>(opts: ObjectFieldOptions<K, V>) =>
  new ObjectField(opts);
