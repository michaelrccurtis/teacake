import { Fields } from "fields";
import Schema from "schema";


test('basic deserialization [load]', () => {
  const schema = new Schema({
    field1: Fields.String(),
    field2: Fields.String()
  });
  const loaded = schema.load({
    field1: "FIELD_1",
    field2: "FIELD_2"
  })
  expect(loaded).toEqual({
    field1: "FIELD_1",
    field2: "FIELD_2"
  });
});

test('basic field properties', () => {

});

test('basic deserialization [dump]', () => {
  const schema = new Schema({
    field1: Fields.String(),
    field2: Fields.String()
  });
  const dumped = schema.dump({
    field1: "FIELD_1",
    field2: "FIELD_2"
  })
  expect(dumped).toEqual({
    field1: "FIELD_1",
    field2: "FIELD_2"
  });
});


test('preload', () => {
  const schema = new Schema({
    field1: Fields.String(),
    field2: Fields.String()
  }, { preLoad: (data) => ({field1: data.field2, field2: 'OTHER'})});
  const loaded = schema.load({
    field1: "FIELD_1",
    field2: "FIELD_2"
  })
  expect(loaded).toEqual({
    field1: "FIELD_2",
    field2: "OTHER"
  });

  const dumped = schema.dump({
    field1: "FIELD_1",
    field2: "FIELD_2"
  });
  expect(dumped).toEqual({
    field1: "FIELD_1",
    field2: "FIELD_2"
  });

});

test('postload', () => {

});


test('preDump', () => {

});


test('postDump', () => {

});