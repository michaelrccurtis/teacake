import { Fields } from "fields";
import { MISSING } from "utils";
import { FieldValidationError } from "errors";

test('basic serialization', () => {
  const field = Fields.String({required: false});
  expect(field.serialize({ attr: 'test', obj: { test: 'TEST' }})).toBe('TEST');
  expect(field.serialize({ attr: 'test', obj: { test: 'TEST' }})).toBe('TEST');
  expect(field.serialize({ attr: 'test', obj: {} })).toBe(MISSING);
});

test('non strings should throw', () => {
  const field = Fields.String();

  expect(() => field.serialize({ attr: 'test', obj: { test: 1 }})).toThrow(FieldValidationError);
  expect(() => field.deserialize({ attr: 'test', data: { test: 1 }})).toThrow(FieldValidationError);
  expect(() => field.serialize({ attr: 'test', obj: { test: {} }})).toThrow(FieldValidationError);
  expect(() => field.deserialize({ attr: 'test', data: { test: {} }})).toThrow(FieldValidationError);
  expect(() => field.serialize({ attr: 'test', obj: { test: new Date() }})).toThrow(FieldValidationError);
  expect(() => field.deserialize({ attr: 'test', data: { test: new Date() }})).toThrow(FieldValidationError);
});

