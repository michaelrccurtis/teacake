# Teacake

Teacake is a Typescript Library for simple object de/serialisation. It is strongly inspired by the Python library [Marshmallow](https://github.com/marshmallow-code/marshmallow).


## Simple Example

```typescript

import { Fields } from "teacake/fields";
import Schema from "teacake/schema";

// First, create a schema for the data you want to load / dump
const schema = new Schema({
  name: Fields.String(missing="Anonymous"),
  age: Fields.Number()
  adminUser: Fields.Bool(missing=false)
});

// Then, load your data
const loaded = schema.load({
  name: "Mike Curtis",
  age: 18,
  adminUser: true,
});

// { name: "Mike Curtis", age: 18, adminUser: true }

// Fields have options that allow for coercion, default setting and validation
const loaded2 = schema.load({
  age: '18',
});

// { name: "Anonymous", age: 18, adminUser: false }
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
