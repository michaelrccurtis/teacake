import { isArray } from "utils";

export class FieldValidationError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, FieldValidationError.prototype);
    }
}

export class ValidationError extends Error {
    constructor(errors: Errors, data:any = {}, validData: any = {}) {
        super("Validation Error");
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export interface Errors {
  [fieldName: string]: this | string[]; // If it is a dictionary
  [index: number]: this | string[]; // If it is list
}

const mergeErrors = (errors1: Errors, errors2: Errors) => {
  if (!errors1) {
    return errors2;
  }
  if (!errors2) {
    return errors1;
  }
  // Need to do deeper merge here
  return {
    ...errors1, ...errors2,
  }
}

class ErrorStore {
  errors: Errors
  constructor() {
    this.errors = {}
  }

  addError(messages: string | string[] | any, fieldNameOrIndex: string | number ="SCHEMA") {
    if (!isArray(messages)) {
      messages = [messages];
    }
    this.errors = mergeErrors(this.errors, {[fieldNameOrIndex]: messages});
  }

  dealWithErrors(data: any, obj: any) {
    console.log("Dealing with errors", this.errors);
    if (Object.keys(this.errors).length > 0) {
      console.log('error present', this.errors);
      throw new ValidationError(this.errors, data, obj);
    } 
  }
}

export type ErrorMessages = {[key: string]: string};

export default ErrorStore;
