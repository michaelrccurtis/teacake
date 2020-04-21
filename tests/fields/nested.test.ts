import { Fields } from "fields";
import { MISSING } from "utils";
import { FieldValidationError } from "errors";
import Schema from "schema";

test("basic serialization", () => {
  const field = Fields.Nested({
    schema: new Schema(
      {
        field1: Fields.String(),
        field2: Fields.String(),
      },
      { preDump: (data) => ({ field1: data.field2, field2: "OTHER" }) }
    ),
    required: false,
  });
  expect(
    field.serialize({
      attr: "test",
      obj: {
        test: {
          field1: "FIELD_1",
          field2: "FIELD_2",
        },
      },
    })
  ).toEqual({
    field1: "FIELD_2",
    field2: "OTHER",
  });
});

test("basic deserialozation", () => {
  class User {
    name: string;
    age: number;
    constructor(name: string, age: number) {
      this.name = name;
      this.age = age;
    }
  }
  const field = Fields.Nested({
    schema: new Schema(
      {
        name: Fields.String(),
        age: Fields.Number(),
      },
      { postLoad: (data) => new User(data.name, data.age) }
    ),
    required: false,
  });
  expect(
    field.deserialize({
      attr: "test",
      data: {
        test: {
          name: "Mike",
          age: 30,
        },
      },
    })
  ).toEqual(new User("Mike", 30));
});
