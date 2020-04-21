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
