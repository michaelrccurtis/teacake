import StringField from "./string";
import NumberField from "./number";
import BoolField from "./bool";
import Nested from "./nested";
import FunctionField from "./function";
import ArrayField from "./array";


export const Fields = {
  'String': StringField,
  'Number': NumberField,
  'Bool': BoolField,
  'Nested': Nested,
  'Function': FunctionField,
  'Array': ArrayField,
}
