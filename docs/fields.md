# Fields

Fields are used to (de)serialize a single value. Creating a field is simple:

```typescript
import { Fields } from "teacake";

const stringField = Fields.String({});
stringField.serialize({ attr: "test", obj: { test: "TEST" } });
// "TEST"

const boolField = Fields.Bool({ missing: false });
boolField.deserialize({ attr: "bool_field_name", obj: {} });
// false

const numberField = Fields.Number({ required: true });
numberField.deserialize({ attr: "numberField", obj: {} });
// Throws FieldValidationError
```

You will rarely call a field's serialize or deserialize functions directly, but will usually run these indirectly as part of loading or dumping a [schema](schemas.md).

They inherit from a simple base class, so adding a custom field is straightforward.

## Fields Helper Object

For simplicity, the fields included with teacake are exported with initialisation functions in the `Fields` object.

```typescript
import { Fields } from "teacake";
import { String } from "teacake/fields/string";

// These are the same
const stringField = Fields.String({ required: true });
const alsoAStringField = new String({ required: true });
```

## Field Options

Fields take an object containing options for configuring how they should treat incoming data.

### Common Field Options

Some options are common to all fields. You can see their types in the FieldOptions Type exported from `teacake/fields/base.ts`.

| Option                 |            Type            |        Default        | Description                                                         |
| :--------------------- | :------------------------: | :-------------------: | :------------------------------------------------------------------ |
| `required`             |         `boolean`          |        `true`         | Whether the field is required, or optional.                         |
| `default`              |           `any`            |       `MISSING`       | The default vaule for the field on _serialization_.                 |
| `missing`              |           `any`            |       `MISSING`       | The default vaule for the field on _deserialization_.               |
| `validate`             |   `(data: any) => void`    | `(data: any) => null` | Validation function for the field                                   |
| `ignore`               |          `any[]`           |     `[undefined]`     | Values that should be treated as though the field is missing.       |
| `loadOnly`             |         `boolean`          |        `false`        | Field is only relevant on load.                                     |
| `dumpOnly`             |         `boolean`          |        `false`        | Field is only relevant on dumping.                                  |
| `errorMessages`        | `{ [key: string]: string}` |         `{}`          | Custom error messages.                                              |
| `treatErrorsAsMissing` |         `boolean`          |        `false`        | Treat errors raised in (de)serialization the same as missing values |

You can see options specific to individual field types below.

## Fields

### Bool Field

The Bool field is designed to (de)serialize Boolean values. It takes the basic field options as above, as well as the following:

| Option             |    Type    |   Default   | Description                                              |
| :----------------- | :--------: | :---------: | :------------------------------------------------------- |
| `strict`           | `boolean`  |   `false`   | If true, will not attempt to coerce strings to booleans. |
| `validTrueStrings` | `string[]` | `['true']`  | Strings to coerce to `true`.                             |
| `falseTrueStrings` | `string[]` | `['false']` | Strings to coerce to `false`.                            |

### String Field

The Bool field is designed to (de)serialize string values.

### Number Field

The Bool field is designed to (de)serialize string values. It takes the basic field options as above, as well as the following:

| Option   |   Type    | Default | Description                                             |
| :------- | :-------: | :-----: | :------------------------------------------------------ |
| `strict` | `boolean` | `false` | If true, will not attempt to coerce strings to numbers. |

### Array Field

The Array field is designed to de(serialize) array values. It takes the basic field options as above, as well as the following:

| Option   |  Type   | Default | Description                                                                  |
| :------- | :-----: | :-----: | :--------------------------------------------------------------------------- |
| `values` | `Field` | `false` | The expected field for the values of the array. This option is **required**. |

### Nested Field

The Nested field is designed to (de)serialize a nested schema. It takes the basic field options as above, as well as the following:

| Option   |   Type   | Default | Description                                                                  |
| :------- | :------: | :-----: | :--------------------------------------------------------------------------- |
| `schema` | `Schema` |   N/A   | The teacake schema object of the nested fields. This option is **required**. |

### Object Field

The Object field is designed to de(serialize) object values when you don't care about the schema of the object. It takes the basic field options as above, as well as the following:

| Option   |  Type   | Default | Description                                                                  |
| :------- | :-----: | :-----: | :--------------------------------------------------------------------------- |
| `keys`   | `Field` | `false` | The expected field for the keys of the array. This option is **required**.   |
| `values` | `Field` | `false` | The expected field for the values of the array. This option is **required**. |

### Function Field

The Function field is designed to generate a dervied value from other fields. It takes the basic field options as above, as well as the following:

| Option |              Type               | Default | Description                                                             |
| :----- | :-----------------------------: | :-----: | :---------------------------------------------------------------------- |
| `f`    | `(value: any, obj: any) => any` |   N/A   | A function to calculate the derived value. This option is **required**. |
