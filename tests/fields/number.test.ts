import { Fields } from "fields";
import { MISSING } from "utils";
import { FieldValidationError } from "errors";

test("basic serialization", () => {
  const field = Fields.Number({ required: false });
  expect(field.serialize({ attr: "test", obj: { test: 1000 } })).toBe(1000);
  expect(field.serialize({ attr: "test", obj: { test: 2000 } })).toBe(2000);
  expect(field.serialize({ attr: "test", obj: {} })).toBe(MISSING);
});

test("should coerce stringified numbers", () => {
  const field = Fields.Number({ required: false });
  expect(field.deserialize({ attr: "test", data: { test: "1000" } })).toBe(
    1000
  );
  expect(field.deserialize({ attr: "test", data: { test: "2000" } })).toBe(
    2000
  );
  expect(field.deserialize({ attr: "test", data: { test: "3.123" } })).toBe(
    3.123
  );
});

test("should not coerce stringified numbers in strict mode", () => {
  const field = Fields.Number({ required: false, strict: true });
  expect(() =>
    field.deserialize({ attr: "test", data: { test: "1000" } })
  ).toThrow(FieldValidationError);
  expect(() =>
    field.deserialize({ attr: "test", data: { test: "2000" } })
  ).toThrow(FieldValidationError);
  expect(() =>
    field.deserialize({ attr: "test", data: { test: "3.123" } })
  ).toThrow(FieldValidationError);
});

test("non numbers should throw", () => {
  const field = Fields.Number();

  expect(() =>
    field.serialize({ attr: "test", obj: { test: "1asd" } })
  ).toThrow(FieldValidationError);
  expect(() =>
    field.deserialize({ attr: "test", data: { test: "string number" } })
  ).toThrow(FieldValidationError);
  expect(() => field.serialize({ attr: "test", obj: { test: {} } })).toThrow(
    FieldValidationError
  );
  expect(() => field.deserialize({ attr: "test", data: { test: {} } })).toThrow(
    FieldValidationError
  );
  expect(() =>
    field.serialize({ attr: "test", obj: { test: new Date() } })
  ).toThrow(FieldValidationError);
  expect(() =>
    field.deserialize({ attr: "test", data: { test: new Date() } })
  ).toThrow(FieldValidationError);
});

test("treatErrorsAsMissing is respected", () => {
  const field = Fields.Number({ missing: 1234, treatErrorsAsMissing: true });
  expect(
    field.deserialize({ attr: "test", data: { test: "A_STRING_NOT_NUMBER" } })
  ).toBe(1234);
});
