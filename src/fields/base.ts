import { getValue, MISSING, isMissing } from "utils";
import { FieldValidationError, ErrorMessages } from "errors";


interface SerializeParams {
  attr: string | number;
  obj: any;
}

interface DeserializeParams {
  attr: string | number;
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
  treatErrorsAsMissing: boolean;
}

export const defaultOpts: FieldOptions = {
  required: true,
  default: MISSING,
  missing: MISSING,
  validate: (data: any) => null,
  ignore: [undefined],
  loadOnly: false,
  dumpOnly: false,
  errorMessages: {},
  treatErrorsAsMissing: false,
};

abstract class Field<T = any, O extends FieldOptions = FieldOptions, A extends string = string> {
    opts: O;
    abstract defaultOpts(): O;
    abstract initialize(): void;

    errorMessages: ErrorMessages = {
      type: "Invalid input type",
      unknownField: "Unknown Field",
    };

    _fieldOpts: Partial<O>;
    _continueOnMissing: boolean;

    constructor(opts: Partial<O>) {
      this._fieldOpts = opts;
      this.opts = {...this.defaultOpts(), ...opts};
      this.addErrorMessages(opts.errorMessages);
      this._continueOnMissing = false;
      this.initialize();
    }
    setGlobalFieldOpts(opts: Partial<O>) {
      this.opts = {...this.defaultOpts(), ...opts, ...this._fieldOpts};
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
      if (isMissing(value) && !this._continueOnMissing) {
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
        if (!this._continueOnMissing) {
          return value;
        }
      }
      try {
        return this._deserialize(value, params);
      } catch(err) {
        if (this.opts.treatErrorsAsMissing) {
          return this._deserialize(this.opts.missing || value, params);
        } else {
          throw err;
        }
      }
    };
}

export default Field;
