import BaseField, { defaultOpts } from "fields/base";
import { MISSING } from "utils";
import { FieldValidationError } from "errors";

class Field extends BaseField {
  initialize() {}
  defaultOpts() {
    return defaultOpts;
  }
}

test("basic serialization", () => {
  const field = new Field({ required: false });
  expect(field.serialize({ attr: "test", obj: { test: "TEST" } })).toBe("TEST");
  expect(field.serialize({ attr: "test", obj: { test: "TEST" } })).toBe("TEST");
  expect(field.serialize({ attr: "test", obj: {} })).toBe(MISSING);
});

test("default is respected", () => {
  const field = new Field({ default: "DEFAULT" });
  expect(field.serialize({ attr: "test", obj: {} })).toBe("DEFAULT");
  expect(field.serialize({ attr: "test", obj: { test: "TEST" } })).toBe("TEST");
});

test("basic deserialization", () => {
  const field = new Field({ required: false });
  expect(field.deserialize({ attr: "test", data: { test: "TEST" } })).toBe(
    "TEST"
  );
  expect(field.deserialize({ attr: "test", data: {} })).toBe(MISSING);
});

test("missing is respected", () => {
  const field = new Field({ missing: "MISSING" });
  expect(field.deserialize({ attr: "test", data: {} })).toBe("MISSING");
});

test("required causes error", () => {
  const field = new Field({ required: true });
  expect(() => field.deserialize({ attr: "test", data: {} })).toThrow(
    FieldValidationError
  );
});

test("ignore is respected", () => {
  const field = new Field({ required: false, ignore: [null, "IGNORE_ME"] });
  expect(field.deserialize({ attr: "test", data: { test: null } })).toBe(
    MISSING
  );
  expect(field.deserialize({ attr: "test", data: { test: "IGNORE_ME" } })).toBe(
    MISSING
  );
  expect(field.deserialize({ attr: "test", data: { test: "FIND_ME" } })).toBe(
    "FIND_ME"
  );

  const field2 = new Field({
    default: "ME_INSTEAD",
    ignore: [null, "IGNORE_ME"],
  });
  expect(field2.serialize({ attr: "test", obj: { test: null } })).toBe(
    "ME_INSTEAD"
  );
  expect(field2.serialize({ attr: "test", obj: { test: "IGNORE_ME" } })).toBe(
    "ME_INSTEAD"
  );
  expect(field2.serialize({ attr: "test", obj: { test: "FIND_ME" } })).toBe(
    "FIND_ME"
  );

  const field3 = new Field({
    missing: "ME_INSTEAD",
    ignore: [null, "IGNORE_ME"],
  });
  expect(field3.deserialize({ attr: "test", data: { test: null } })).toBe(
    "ME_INSTEAD"
  );
  expect(
    field3.deserialize({ attr: "test", data: { test: "IGNORE_ME" } })
  ).toBe("ME_INSTEAD");
  expect(field3.deserialize({ attr: "test", data: { test: "FIND_ME" } })).toBe(
    "FIND_ME"
  );
});

const getThrownError = (func: () => void) => {
  try {
    func();
  } catch (error) {
    return error;
  }
  return null;
};

test("error messages", () => {
  const field = new Field({ errorMessages: { error: "ERROR MESSAGE" } });
  const error1 = () => field.error("error");
  expect(error1).toThrow(FieldValidationError);
  const thrown1 = getThrownError(error1);
  expect(thrown1.message).toBe("ERROR MESSAGE");
  const error2 = () => field.error("other_error");
  expect(error2).toThrow(FieldValidationError);
  const thrown2 = getThrownError(error2);
  expect(thrown2.message).toBe("Error in Field: other_error");
});
