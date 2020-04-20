import { getValue, MISSING, isMissing } from "utils";
import { FieldValidationError, ErrorMessages } from "errors";


interface SerializeParams {
  attr: string;
  obj: any;
}

interface DeserializeParams {
  attr: string;
  data: any;
}

export interface FieldOptions {
  default: any;
  missing: any;
  validate: (data: any) => void;
  required: boolean;
  ignore: any[];
  loadOnly: boolean;
  dumpOnly: boolean;
  errorMessages: ErrorMessages;
}

export const defaultOpts: FieldOptions = {
  default: MISSING,
  missing: MISSING,
  validate: (data: any) => null,
  required: true,
  ignore: [undefined],
  loadOnly: false,
  dumpOnly: false,
  errorMessages: {},
};

abstract class Field<T = any, O extends FieldOptions = FieldOptions, A extends string = string> {
    opts: O;
    abstract defaultOpts(): O;
    errorMessages: ErrorMessages = {
      type: "Invalid input type",
      unknownField: "Unknown Field",
    };
    constructor(opts: Partial<O>) {
      const defaultOpts = this.defaultOpts();
      this.opts = {...defaultOpts, ...opts};
      this.validateOpts();
      this.addErrorMessages(opts.errorMessages);
    }
    initialize() {

    }
    validateOpts() {
      
    }
    addErrorMessages(errorMessages: ErrorMessages | undefined) {
      this.errorMessages = {...this.errorMessages, ...errorMessages};
    }
    _serialize(value: any, params: SerializeParams) {
      return value
    };
    _deserialize(value: any, params: DeserializeParams): T {
      return value;
    }
    error (errorKey: string) {
      const message = this.errorMessages[errorKey] || `Error in Field: ${errorKey}`;
      throw new FieldValidationError(message);
    }
    serialize (params: SerializeParams) {
      let value = getValue(params.obj, params.attr, this.opts.ignore);
      if (isMissing(value)) {
        value = this.opts.default || value;
      }
      if (isMissing(value)) {
        return value;
      }
      return this._serialize(value, params)
    };
    deserialize (params: DeserializeParams): T {
      let value = getValue(params.data, params.attr, this.opts.ignore);
      if (isMissing(value)) {
        value = this.opts.missing || value;
      }
      if (isMissing(value)) {
        if (this.opts.required) {
          this.error('required');
        }
      }
      return this._deserialize(value, params);
    };
}

export default Field;
