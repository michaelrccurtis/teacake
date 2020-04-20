import { Fields } from "fields";
import { MISSING } from "utils";
import { FieldValidationError } from "errors";

test('basic serialization', () => {
  const field = Fields.Bool({required: false});
  expect(field.serialize({ attr: 'test', obj: { test: true }})).toBe(true);
  expect(field.serialize({ attr: 'test', obj: { test: false }})).toBe(false);
  expect(field.serialize({ attr: 'test', obj: {} })).toBe(MISSING);
});

test('should coerce stringified booleans', () => {
  const field = Fields.Bool({required: false});
  expect(field.deserialize({ attr: 'test', data: { test: "true" }})).toBe(true);
  expect(field.deserialize({ attr: 'test', data: { test: "false" }})).toBe(false);
});

test('should coerce stringified booleans with optional strings', () => {
  const field = Fields.Bool({required: false, validTrueStrings: ['TRUE', 'teacake_is_the_best'], validFalseStrings: ['FALSE', 'serialization_is_boring']});
  expect(field.deserialize({ attr: 'test', data: { test: "TRUE" }})).toBe(true);
  expect(field.deserialize({ attr: 'test', data: { test: "teacake_is_the_best" }})).toBe(true);
  expect(field.deserialize({ attr: 'test', data: { test: "FALSE" }})).toBe(false);
  expect(field.deserialize({ attr: 'test', data: { test: "serialization_is_boring" }})).toBe(false);
});

test('should coerce stringified booleans with optional strings', () => {
  const field = Fields.Bool({required: false, strict: true, validTrueStrings: ['TRUE', 'teacake_is_the_best'], validFalseStrings: ['FALSE', 'serialization_is_boring']});
  expect(() => field.deserialize({ attr: 'test', data: { test: "TRUE" }})).toThrow(FieldValidationError);
  expect(() => field.deserialize({ attr: 'test', data: { test: "teacake_is_the_best" }})).toThrow(FieldValidationError);
  expect(() => field.deserialize({ attr: 'test', data: { test: "FALSE" }})).toThrow(FieldValidationError);
  expect(() => field.deserialize({ attr: 'test', data: { test: "serialization_is_boring" }})).toThrow(FieldValidationError);
});


test('non numbers should throw', () => {
  const field = Fields.Bool();

  expect(() => field.serialize({ attr: 'test', obj: { test: '1asd' }})).toThrow(FieldValidationError);
  expect(() => field.deserialize({ attr: 'test', data: { test: 'string number' }})).toThrow(FieldValidationError);
  expect(() => field.serialize({ attr: 'test', obj: { test: {} }})).toThrow(FieldValidationError);
  expect(() => field.deserialize({ attr: 'test', data: { test: {} }})).toThrow(FieldValidationError);
  expect(() => field.serialize({ attr: 'test', obj: { test: new Date() }})).toThrow(FieldValidationError);
  expect(() => field.deserialize({ attr: 'test', data: { test: new Date() }})).toThrow(FieldValidationError);
});

