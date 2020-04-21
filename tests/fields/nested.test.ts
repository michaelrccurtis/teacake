import { Fields } from "fields";
import { MISSING } from "utils";
import { FieldValidationError } from "errors";
import Schema from "schema";


test('basic serialization', () => {
  const field = Fields.Nested({
    schema: new Schema({
      field1: Fields.String(),
      field2: Fields.String(),
    }, { preLoad: (data) => ({field1: data.field2, field2: 'OTHER'})}),
    required: false
  });
  expect(field.deserialize({ attr: 'test', data: { test: {
    field1: 'FIELD_1',
    field2: 'FIELD_2',
  } }})).toEqual({
    field1: 'FIELD_2',
    field2: 'OTHER'
  });
});
