import { isArray } from "utils";

export interface Errors {
  [fieldName: string]: this | string[]; // If it is a obj
  [index: number]: this | string[]; // If it is list
}

export class FieldValidationError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, FieldValidationError.prototype);
  }
}

export class ValidationError extends Error {
  constructor(errors: Errors, data: any = {}, validData: any = {}) {
    super("Validation Error: " + JSON.stringify(errors));
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export const mergeErrors = (
  errors1: Errors | string[] | undefined,
  errors2: Errors | string[] | undefined
): Errors | string[] => {
  if (errors1 === undefined && errors2 === undefined) {
    return {};
  }
  if (errors1 === undefined) {
    return errors2 as Errors | string[];
  }
  if (errors2 === undefined) {
    return errors1;
  }

  if (isArray(errors1) && isArray(errors2)) {
    return [...errors1, ...errors2];
  }
  if (isArray(errors1) && !isArray(errors2)) {
    return { ...errors2, SCHEMA: mergeErrors(errors2.SCHEMA, errors1) };
  }
  if (isArray(errors2) && !isArray(errors1)) {
    return { ...errors1, SCHEMA: mergeErrors(errors1.SCHEMA, errors2) };
  }
  // Need to do deeper merge here
  const allKeys = Array.from(
    new Set(Object.keys(errors1).concat(Object.keys(errors2)))
  );

  return allKeys.reduce((acc, key: string) => {
    const ret = (acc[key] = mergeErrors(
      (errors1 as Errors)[key],
      (errors2 as Errors)[key] as any
    ));
    return acc;
  }, {} as any);
};

class ErrorStore {
  errors: Errors;
  constructor() {
    this.errors = {};
  }

  addError(
    messages: string | string[] | any,
    fieldNameOrIndex: string | number = "SCHEMA"
  ) {
    if (!isArray(messages)) {
      messages = [messages];
    }
    this.errors = mergeErrors(this.errors, {
      [fieldNameOrIndex]: messages,
    }) as Errors;
  }

  dealWithErrors(data: any, obj: any) {
    if (Object.keys(this.errors).length > 0) {
      // console.log("Erroring with error:", this.errors);
      throw new ValidationError(this.errors, data, obj);
    }
  }
}

export type ErrorMessages = { [key: string]: string };

export default ErrorStore;
