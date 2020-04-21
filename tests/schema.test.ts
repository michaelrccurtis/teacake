import { Fields } from "fields";
import Schema from "schema";

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

test("basic deserialization [dump]", () => {
  const schema = new Schema({
    field1: Fields.String(),
    field2: Fields.String(),
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

test("postload", () => {});

test("preDump", () => {});

test("postDump", () => {});
