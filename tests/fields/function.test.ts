import { Fields } from "fields";
import { MISSING } from "utils";
import { FieldValidationError } from "errors";
import Schema from "schema";

test("function of value", () => {
  const field = Fields.Function({
    f: (value: number, obj) => value + 2,
  });
  expect(field.deserialize({ attr: "test", data: { test: 2 } })).toBe(4);
});

test("function of whole object", () => {
  const schema = new Schema({
    field1: Fields.String({ required: false }),
    field2: Fields.String({ required: false }),
    functionField: Fields.Function({
      f: (value: any, obj: any): string => {
        return obj.field1 + obj.field2;
      },
    }),
  });

  const loaded = schema.load({ field1: "START", field2: "END" });
  expect(loaded).toEqual({ field1: "START", field2: "END", functionField: "STARTEND" });
});
