import { isMissing, isObject, getValue, difference, MISSING } from "utils";
import Field from "./fields/base"
import ErrorStore, { ErrorMessages } from "./errors";

interface SchemaOptions<A extends Record<string, string> | {} = {}, D extends Record<string, string> | {} = {}> {
  errorMessages: ErrorMessages;
  unknown: "INCLUDE" | "EXCLUDE" | "RAISE";
  preLoad: (obj: any) => any;
  postLoad: (obj: any) => any;
  preDump: (obj: any) => any;
  postDump: (obj: any) => any;
  attributeMap: A | {};
  dataKeyMap: D | {};
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
  attributeMap: {},
  dataKeyMap: {},
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

export class Schema<F extends FieldObject, A extends Record<string, string>, D extends Record<string, string>> {
  opts: SchemaOptions<A, D>;
  defaultOpts = defaultOpts;
  errorMessages: ErrorMessages;
  loadFields: Partial<F> = {};
  dumpFields: Partial<F> = {};

  constructor(fields: F, opts: Partial<SchemaOptions<A, D>> = {}) {
    this.opts = {...this.defaultOpts, ...opts};
    this.errorMessages = {...this.defaultOpts.errorMessages, ...opts.errorMessages};

    for (let [fieldName, fieldObj] of Object.entries(fields)) {
      if (!fieldObj.opts.dumpOnly) {
        (this.loadFields as any)[fieldName] = fieldObj;
      }
      if (!fieldObj.opts.loadOnly) {
        (this.dumpFields as any)[fieldName] = fieldObj;
      }
    }
  }

  _attribute(dataKey: string) {
    if (dataKey in this.opts.attributeMap) {
      return (this.opts.attributeMap as Record<string, string>)[dataKey];
    }
    return dataKey;
  }

  _dataKey(attribute: string) {
    if (attribute in this.opts.dataKeyMap) {
      return (this.opts.dataKeyMap as Record<string, string>)[attribute];
    }
    return attribute;
  }

  _serialize(props: {obj: any}): [any, ErrorStore] {
    const ret: any = {};
    let errors = new ErrorStore();
    for (let [fieldName, fieldObj] of Object.entries<Field>(this.dumpFields as any)) {
      const value = fieldObj.serialize({
        attr: fieldName, obj: props.obj
      });
      if (isMissing(value)) {
        // we ignore missing fields on serialization
        continue;
      }
      const key = this._dataKey(fieldName);
      ret[key] = value;
    }
    return [ret, errors];
  };

  _deserialize(props: {data: any}) : [any, ErrorStore] {
    const ret: any = {};
    let errorStore = new ErrorStore();
    if (!isObject(props.data)) {
      errorStore.addError(this.errorMessages.type);
      return [{}, errorStore];
    }
    for (let [fieldName, fieldObj] of Object.entries<Field>(this.loadFields as any)) {
      const key = this._dataKey(fieldName);
      const rawValue = getValue(props.data, key);
      if (isMissing(rawValue)) {
        // continue here if partial
      }
      const value = getValue(props.data, fieldName);
      try {
        let deserializedValue = fieldObj._deserialize(value, {attr: fieldName, data: props.data})
      } catch (err) {
        errorStore.addError(err.messages, fieldName);
        let deserializedValue = err.validData || MISSING;
      }
      const attribute = this._attribute(fieldName);
      ret[attribute] = rawValue;
    }

    if (this.opts.unknown !== "EXCLUDE") {
      const mappedFields = new Set(Object.entries(this.loadFields).map(([fieldName, fieldObj]: any, index) => fieldObj.dataKey || fieldName));

      var allInputFields = new Set(Object.keys(props.data));

      for (const key of difference(allInputFields, mappedFields)) {
        const value = props.data[key];
        if (this.opts.unknown === "INCLUDE") {
          ret[key] = value;
        } else if (this.opts.unknown === "RAISE") {
          errorStore.addError(this.errorMessages.unknown, key);
        }
      }
    }

    return [ret, errorStore];
  };

  load(loadData: any): MapKeys<F, A> {
    let data = this.opts.preLoad(loadData);
    let [obj, errorStore] = this._deserialize({ data });
    // field-level- validation
    // schema level validation

    obj = this.opts.postLoad(obj);
    errorStore.dealWithErrors(data, obj);
    return obj;
  };

  dump(dumpObj: any) {
    let obj = this.opts.preDump(dumpObj);
    let [data, errors] = this._serialize({obj});
    data = this.opts.postDump(data);
    return data;
  }
}

export default Schema;
