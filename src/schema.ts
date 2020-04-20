import { isMissing, isObject, getValue, difference, MISSING } from "utils";
import Field, { FieldOptions } from "./fields/base"
import ErrorStore, { ErrorMessages } from "./errors";

interface SchemaOptions<DK extends Record<string, string> | {} = {}, SK extends Record<string, string> | {} = {}> {
  errorMessages: ErrorMessages;
  unknown: "INCLUDE" | "EXCLUDE" | "RAISE";
  preLoad: (obj: any) => any;
  postLoad: (obj: any) => any;
  preDump: (obj: any) => any;
  postDump: (obj: any) => any;
  mapFieldsToSerializedKeys: SK | {};
  mapFieldsToDeserializedKeys: DK | {};
  globalFieldOpts: Partial<FieldOptions>;
}

const defaultOpts: SchemaOptions = {
  errorMessages: {
    type: "Invalid input type",
    unknownField: "Unknown Field",
  },
  unknown: "EXCLUDE",
  preLoad: (obj) => obj,
  postLoad: (obj) => obj,
  preDump: (obj) => obj,
  postDump: (obj) => obj,
  mapFieldsToSerializedKeys: {},
  mapFieldsToDeserializedKeys: {},
  globalFieldOpts: {}
}

export interface FieldObject {
  [key: string]: Field
}

type ValueOf<T> = T[keyof T]
type KeyValueTupleToObject<T extends [keyof any, any]> = {
  [K in T[0]]: Extract<T, [K, any]>[1]
}
type MapKeys<T, M extends Record<string, string>> =
  KeyValueTupleToObject<ValueOf<{
    [K in keyof T]: [K extends keyof M ? M[K] : K, T[K]]
  }>>

const wrapProcessor = (processor: (obj: any) => any | undefined) => (processor) ? processor : (val: any) => val;

export class Schema<F extends FieldObject, DK extends Record<string, string>, SK extends Record<string, string>> {
  opts: SchemaOptions<DK, SK>;
  defaultOpts = defaultOpts;
  errorMessages: ErrorMessages;
  loadFields: Partial<F> = {};
  dumpFields: Partial<F> = {};

  constructor(fields: F, opts: Partial<SchemaOptions<DK, SK>> = {}) {
    this.opts = {...this.defaultOpts, ...opts};
    this.errorMessages = {...this.defaultOpts.errorMessages, ...opts.errorMessages};

    for (let [fieldName, fieldObj] of Object.entries(fields)) {
      fieldObj.setGlobalFieldOpts(this.opts.globalFieldOpts);
      if (!fieldObj.opts.dumpOnly) {
        (this.loadFields as any)[fieldName] = fieldObj;
      }
      if (!fieldObj.opts.loadOnly) {
        (this.dumpFields as any)[fieldName] = fieldObj;
      }
    }
  }

  _serializedKey(key: string) {
    if (key in this.opts.mapFieldsToSerializedKeys) {
      return (this.opts.mapFieldsToSerializedKeys as Record<string, string>)[key];
    }
    return key;
  }

  _deserializedKey(key: string) {
    if (key in this.opts.mapFieldsToDeserializedKeys) {
      return (this.opts.mapFieldsToDeserializedKeys as Record<string, string>)[key];
    }
    return key;
  }

  _serialize(params: {obj: any}): [any, ErrorStore] {
    const ret: any = {};
    let errors = new ErrorStore();
    for (let [fieldName, fieldObj] of Object.entries<Field>(this.dumpFields as any)) {
      const value = fieldObj.serialize({
        attr: this._deserializedKey(fieldName), obj: params.obj
      });
      if (isMissing(value)) {
        // we ignore missing fields on serialization
        continue;
      }
      const key = this._serializedKey(fieldName);
      ret[key] = value;
    }
    return [ret, errors];
  };

  _deserialize(params: {data: any}) : [any, ErrorStore] {
    const ret: any = {};
    let errorStore = new ErrorStore();
    if (!isObject(params.data)) {
      errorStore.addError(this.errorMessages.type);
      return [{}, errorStore];
    }
    for (let [fieldName, fieldObj] of Object.entries<Field>(this.loadFields as any)) {
      const sKey = this._serializedKey(fieldName);
      const value = getValue(params.data, sKey);
      if (isMissing(value)) {
        // continue here if partial
      }
      let deserializedValue = MISSING;
      try {
        deserializedValue = fieldObj.deserialize({attr: sKey, data: params.data});
      } catch (err) {
        errorStore.addError(err.messages, fieldName);
        deserializedValue = err.validData || MISSING;
      }

      if (!isMissing(deserializedValue)) {
        const dKey = this._deserializedKey(fieldName);
        ret[dKey] = deserializedValue;
      }
    }

    if (this.opts.unknown !== "EXCLUDE") {
      const mappedFields = new Set(Object.entries(this.loadFields).map(([fieldName, fieldObj]: any, index) => this._deserializedKey(fieldName)));

      var allInputFields = new Set(Object.keys(params.data));

      for (const key of difference(allInputFields, mappedFields)) {
        const value = params.data[key];
        if (this.opts.unknown === "INCLUDE") {
          ret[key] = value;
        } else if (this.opts.unknown === "RAISE") {
          errorStore.addError(this.errorMessages.unknown, key);
        }
      }
    }

    return [ret, errorStore];
  };

  load(loadData: any): MapKeys<F, DK> {
    let data = this.opts.preLoad(loadData);
    let [obj, errorStore] = this._deserialize({ data });
    // field-level- validation
    // schema level validation

    obj = this.opts.postLoad(obj);
    errorStore.dealWithErrors(data, obj);
    return obj;
  };

  dump(dumpObj: any): MapKeys<F, SK> {
    let obj = this.opts.preDump(dumpObj);
    let [data, errors] = this._serialize({obj});
    data = this.opts.postDump(data);
    return data;
  }
}

export default Schema;
