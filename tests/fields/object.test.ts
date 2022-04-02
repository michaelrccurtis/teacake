import { Fields } from "fields";
import { MISSING } from "utils";
import { FieldValidationError } from "errors";
import Schema from "schema";

test("basic deserialization", () => {
  const field = Fields.Object({
    keys: Fields.String(),
    values: Fields.Number({ missing: 100 }),
  });
  expect(
    field.deserialize({
      attr: "test",
      data: {
        test: {
          key1: 1,
          key2: 2,
          key3: undefined,
        },
      },
    })
  ).toEqual({ key1: 1, key2: 2, key3: 100 });
});

test("basic serialization", () => {
  const field = Fields.Object({
    keys: Fields.String(),
    values: Fields.Number({ default: 100 }),
  });
  expect(
    field.serialize({
      attr: "test",
      obj: {
        test: {
          key1: 1,
          key2: 2,
          key3: undefined,
        },
      },
    })
  ).toEqual({ key1: 1, key2: 2, key3: 100 });
});

test("non objects should throw", () => {
  const field = Fields.Object({
    keys: Fields.String(),
    values: Fields.Number({ missing: 100 }),
  });

  expect(() =>
    field.serialize({ attr: "test", obj: { test: "1asd" } })
  ).toThrow(FieldValidationError);
  expect(() =>
    field.deserialize({ attr: "test", data: { test: "string number" } })
  ).toThrow(FieldValidationError);
  expect(() => field.serialize({ attr: "test", obj: { test: 1234 } })).toThrow(
    FieldValidationError
  );
  expect(() =>
    field.deserialize({ attr: "test", data: { test: 1234 } })
  ).toThrow(FieldValidationError);
  expect(() =>
    field.serialize({ attr: "test", obj: { test: new Date() } })
  ).toThrow(FieldValidationError);
  expect(() =>
    field.deserialize({ attr: "test", data: { test: new Date() } })
  ).toThrow(FieldValidationError);
});
