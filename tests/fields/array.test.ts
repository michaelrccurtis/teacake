import { Fields } from "fields";
import { MISSING } from "utils";
import { FieldValidationError } from "errors";
import Schema from "schema";

test("basic deserialization", () => {
  const field = Fields.Array({ values: Fields.Number() });
  expect(
    field.deserialize({ attr: "test", data: { test: [1, 2, 3] } })
  ).toEqual([1, 2, 3]);
});

test("basic serialization", () => {
  const field = Fields.Array({ values: Fields.Number() });
  expect(field.serialize({ attr: "test", obj: { test: [1, 2, 3] } })).toEqual([
    1, 2, 3,
  ]);
});

test("non arrays should throw", () => {
  const field = Fields.Array({ values: Fields.Number() });

  expect(() =>
    field.serialize({ attr: "test", obj: { test: "1asd" } })
  ).toThrow(FieldValidationError);
  expect(() =>
    field.deserialize({ attr: "test", data: { test: "string number" } })
  ).toThrow(FieldValidationError);
});
