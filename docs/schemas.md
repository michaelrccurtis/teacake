# Schemas

Schemas represent a whole object to be (de)serialized. When schemas are created they take two options:

- a collection of [fields](fields.md)
- an object defining options that customise the (de)serialization.

Fields are passed as an object, where the key should usually define the key the field will map to in the final de(serialized) object (this can be customised - see below). For example:

```typescript
import { Schema, Fields } from 'teacake';

const schema = new Schema({
  name: Fields.String(missing='Anonymous'),
  age: Fields.Number()
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

| Option            |               Type                |    Default     | Description                                                                                                |
| :---------------- | :-------------------------------: | :------------: | :--------------------------------------------------------------------------------------------------------- |
| `unknown`         | `'INCLUDE' | 'EXCLUDE' | 'RAISE'` |  `'EXCLUDE'`   | Defines how keys not present in the schema should be treated (see below)                                   |
| `globalFieldOpts` |      `Partial<FieldOptions>`      |      `{}`      | Options that should be applied to all fields. Note that options on individual fields will take precedence. |
| `preLoad`         |        `(obj: any) => any`        | `(obj) => obj` | Transformation function run before load                                                                    |
| `postLoad`        |        `(obj: any) => any`        | `(obj) => obj` | Transformation function run after load                                                                     |
| `preDump`         |        `(obj: any) => any`        | `(obj) => obj` | Transformation function run before dumping                                                                 |
| `postDump`        |        `(obj: any) => any`        | `(obj) => obj` | Transformation function run after dumping                                                                  |
| `attributeMap`    |     `Record<string, string>`      |      `{}`      | Mapping of keys that should take place on load (see below)                                                 |
| `dataKeyMap`      |     `Record<string, string>`      |      `{}`      | Mapping of keys that should take place on dumping (see below)                                              |

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
  
The `attributeMap` and `dataKeyMap` options allow you to specify how fields that should be mapped. Ideally, you specify this useing the key of each field when you pass it into the schema, however this is not always possible or desired.


