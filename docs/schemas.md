# Schemas

Schemas represent a whole object to be (de)serialized. When schemas are created they take two options:

- a collection of [fields](fields.md)
- an object defining options that customise the (de)serialization.

Fields are passed as an object, where the key should usually define the key the field will map to in the final de(serialized) object (this can be customised - see below). For example:

```typescript
import { Schema, Fields } from 'teacake';

const schema = new Schema({
  name: Fields.String(missing='Anonymous'),
  age: Fields.Number(),
  adminUser: Fields.Bool(missing=false)
});

const loaded = schema.load({
  name: 'Mike Curtis',
  age: 18,
  adminUser: true,
});
// { name: 'Mike Curtis', age: 18, adminUser: true }

```

## Schema Options:

| Option                        |               Type                |    Default     | Description                                                                                                |
| :---------------------------- | :-------------------------------: | :------------: | :--------------------------------------------------------------------------------------------------------- |
| `unknown`                     | `'INCLUDE' | 'EXCLUDE' | 'RAISE'` |  `'EXCLUDE'`   | Defines how keys not present in the schema should be treated (see below)                                   |
| `globalFieldOpts`             |      `Partial<FieldOptions>`      |      `{}`      | Options that should be applied to all fields. Note that options on individual fields will take precedence. |
| `preLoad`                     |        `(obj: any) => any`        | `(obj) => obj` | Transformation function run before load                                                                    |
| `postLoad`                    |        `(obj: any) => any`        | `(obj) => obj` | Transformation function run after load                                                                     |
| `preDump`                     |        `(obj: any) => any`        | `(obj) => obj` | Transformation function run before dumping                                                                 |
| `postDump`                    |        `(obj: any) => any`        | `(obj) => obj` | Transformation function run after dumping                                                                  |
| `mapFieldsToSerializedKeys`   |     `Record<string, string>`      |      `{}`      | Mapping of field keys to key in serialized data                                                            |
| `mapFieldsToDeserializedKeys` |     `Record<string, string>`      |      `{}`      | Mapping of field keys to keys in deserialized                                                              |

### Unknown Field Behaviour

The `unknown` option defines how the schema should treat keys that are not specified in the field options object.

- `INCLUDE`: extra fields should be included in the resulting object. Note that this will not currently be reflected in the type of the object returned.
- `EXCLUDE`: extra fields should be ignored, and will be excluded from the resulting object
- `RAISE`: extra fields should be treated as errors, and will cause the schema to throw a `ValidationError` exception.

### Transformation hooks

The fields `preLoad`, `postLoad`, `preDump`, `postDump` are designed to be for any data transformations that you cannot express using fields.

```typescript
import { Schema, Fields } from "teacake";

const schema = new Schema(
  {
    field1: Fields.String(),
    field2: Fields.String(),
  },
  { preLoad: (data) => ({ field1: data.field2, field2: "OTHER" }) }
);
const loaded = schema.load({ field1: "FIELD_1", field2: "FIELD_2" });
// { field1: "FIELD_2", field2: "OTHER" });
```

### Mapping keys

The `mapFieldsToSerializedKeys` and `mapFieldsToDeserializedKeys` options allow you to specify how fields that should be mapped. Ideally, you specify this useing the key of each field when you pass it into the schema, however this is not always possible or desired.

For example:

```typescript
import { Schema, Fields } from "teacake";

const schema = new Schema({
  loadField: Fields.String(),
}, {
  mapFieldsToSerializedKeys: {
    loadField: 'field' as const // loadField will look for value at at data['field']
  }
});
const loaded = schema.load({ field: 'A STRING' });
// { loadField: 'A STRING' });

const schema = new Schema({
  dumpField: Fields.String({ loadOnly: true }),
}, {
  mapFieldsToDeserializedKeys: {
    dumpField: 'field' as const
  }
});
const dumped = schema.dump({ field: 'A STRING' });
// { dumpField: 'A STRING' });
```

One use case for this is where you want to specify different behaviour on load or dump:

```typescript
import { Schema, Fields } from "teacake";

const schema = new Schema({
  oldUserAgeAsString: Fields.String({ loadOnly: true }),
  age: Fields.Number({ dumpOnly: true })
}, {
  mapFieldsToSerializedKeys: {
    oldUserAgeAsString: 'age' as const
  }
});
const loaded = schema.load({ age: '30' });
// { oldUserAgeAsString: '30' };

const dumped = schema.dump({ age: 30 });
// { age: 30 }
```

Note that specifying the mapped keys with `'string' as const` allows typescript to infer the types properly. Dropping the `as const` will result in looser typing.
