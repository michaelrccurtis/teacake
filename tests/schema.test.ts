import { Fields } from "fields";
import Schema from "schema";
import { ValidationError } from "errors";

test("basic deserialization [load]", () => {
  const schema = new Schema({
    field1: Fields.String(),
    field2: Fields.String(),
  });
  const loaded = schema.load({
    field1: "FIELD_1",
    field2: "FIELD_2",
  });
  expect(loaded).toEqual({
    field1: "FIELD_1",
    field2: "FIELD_2",
  });
});

test("basic field properties", () => {
  const schema = new Schema(
    {
      field1: Fields.String({ required: false }),
      field2: Fields.String({ missing: "FIELD_2" }),
    },
    { unknown: "INCLUDE" }
  );
  const loaded = schema.load({});
  expect(loaded).toEqual({
    field2: "FIELD_2",
  });
});

test("unknown include", () => {
  const schema = new Schema({}, { unknown: "INCLUDE" });
  expect(schema.load({ test: "TEST" })).toEqual({
    test: "TEST",
  });
});

test("unknown exclude", () => {
  const schema = new Schema({}, { unknown: "EXCLUDE" });
  expect(schema.load({ test: "TEST" })).toEqual({});
});

test("unknown raise", () => {
  const schema = new Schema({}, { unknown: "RAISE" });
  expect(() => schema.load({ test: "TEST" })).toThrow(ValidationError);
});

test("global field opts", () => {
  const schema = new Schema(
    {
      field1: Fields.String({ required: false }),
      field2: Fields.String({ missing: "FIELD_2" }),
    },
    { unknown: "INCLUDE", globalFieldOpts: { missing: "MISSING" } }
  );
  const loaded = schema.load({});
  expect(loaded).toEqual({
    field1: "MISSING",
    field2: "FIELD_2",
  });
});

test("basic serialization [dump]", () => {
  const schema = new Schema({
    field1: Fields.String(),
    field2: Fields.String(),
    field3: Fields.String(),
  });
  const dumped = schema.dump({
    field1: "FIELD_1",
    field2: "FIELD_2",
  });
  expect(dumped).toEqual({
    field1: "FIELD_1",
    field2: "FIELD_2",
  });
});

test("non objects should error on load", () => {
  const schema = new Schema({
    field1: Fields.String(),
  });
  expect(() => schema.load([])).toThrow(ValidationError);
});

test("errors in fields should be passed on ", () => {
  const schema = new Schema({
    field1: Fields.String(),
  });
  expect(() => schema.load({})).toThrow(ValidationError);
});

test("mapFieldsToDeserializedKeys should be respected", () => {
  const schema = new Schema(
    {
      field: Fields.Number({ loadOnly: true }),
      dumpField: Fields.Number({ dumpOnly: true }),
    },
    {
      mapFieldsToDeserializedKeys: {
        dumpField: "field", //  dump will pull value from here
      },
    }
  );
  expect(
    schema.load({
      field: 12345,
    })
  ).toEqual({
    field: 12345,
  });
  expect(
    schema.dump({
      field: 54321,
    })
  ).toEqual({
    dumpField: 54321,
  });
});

test("mapFieldsToSerializedKeys should be respected", () => {
  const schema = new Schema(
    {
      loadField: Fields.String({ loadOnly: true }),
      field: Fields.Number({ dumpOnly: true }),
    },
    {
      mapFieldsToSerializedKeys: {
        loadField: "field", // load will pull value from here
      },
    }
  );
  expect(schema.load({ field: "12345" })).toEqual({
    loadField: "12345",
  });
  expect(schema.dump({ field: 54321 })).toEqual({
    field: 54321,
  });
});

test("map to multiple fields on load should work", () => {
  const schema = new Schema(
    {
      field: Fields.Number(),
      loadField: Fields.Number(),
    },
    {
      mapFieldsToSerializedKeys: {
        loadField: "field" as const,
      },
    }
  );
  expect(
    schema.load({
      field: 1,
    })
  ).toEqual({
    field: 1,
    loadField: 1,
  });
  expect(
    schema.dump({
      field: 1,
      loadField: 2,
    })
  ).toEqual({
    field: 2,
  });
});

test("both maps should work", () => {
  const schema = new Schema(
    {
      field: Fields.Number(),
      field2: Fields.Number(),
    },
    {
      mapFieldsToSerializedKeys: {
        field: "field2" as const,
        field2: "field" as const,
      },
    }
  );
  expect(
    schema.load({
      field: 1,
      field2: 2,
    })
  ).toEqual({
    field: 2,
    field2: 1,
  });
});

test("error object should be as expected", () => {});

test("preload", () => {
  const schema = new Schema(
    {
      field1: Fields.String(),
      field2: Fields.String(),
    },
    { preLoad: (data) => ({ field1: data.field2, field2: "OTHER" }) }
  );
  const loaded = schema.load({
    field1: "FIELD_1",
    field2: "FIELD_2",
  });
  expect(loaded).toEqual({
    field1: "FIELD_2",
    field2: "OTHER",
  });

  const dumped = schema.dump({
    field1: "FIELD_1",
    field2: "FIELD_2",
  });
  expect(dumped).toEqual({
    field1: "FIELD_1",
    field2: "FIELD_2",
  });
});

test("real world", () => {
  const schema = new Schema(
    {
      area: Fields.String({ missing: "United Kingdom" }),
      depositPct: Fields.Number({ missing: 10 }),
      movingCosts: Fields.Number({ missing: 600 }),
      legalFees: Fields.Number({ missing: 1200 }),
      calculatePropertyTax: Fields.Bool({ missing: false }),
      propertyTax: Fields.Number({ missing: 0 }),
    },
    {
      unknown: "INCLUDE",
      globalFieldOpts: {
        ignore: [null, undefined],
        treatErrorsAsMissing: true,
      },
    }
  );

  const loaded = schema.load({
    legalFees: null,
    calculatePropertyTax: "error",
    movingCosts: undefined,
  });
  expect(loaded).toEqual({
    area: "United Kingdom",
    depositPct: 10,
    movingCosts: 600,
    legalFees: 1200,
    calculatePropertyTax: false,
    propertyTax: 0,
  });
});

test("postload", () => {
  class User {
    name: string;
    age: number;
    constructor(name: string, age: number) {
      this.name = name;
      this.age = age;
    }
  }
  const schema = new Schema(
    {
      name: Fields.String(),
      age: Fields.Number(),
    },
    {
      postLoad: (data) => new User(data.name, data.age),
    }
  );
  const loaded = schema.load({
    name: "Mike",
    age: 30,
  });
  expect(loaded).toEqual(new User("Mike", 30));
});

test("preDump", () => {});

test("postDump", () => {});
