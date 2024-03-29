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

  const dumped = schema.dump({ field1: "START", field2: "END" });
  expect(dumped).toEqual({
    field1: "START",
    field2: "END",
    functionField: "STARTEND",
  });
});

test("function errors should throw field validation errors", () => {
  const field = Fields.Function({
    f: (value: number, obj) => {
      const x = {};
      return (x as any).y.z;
    },
  });

  expect(() => field.deserialize({ attr: "test", data: { test: 2 } })).toThrow(
    FieldValidationError
  );
});
