import {
  toType,
  isArray,
  isObject,
  difference,
  MISSING,
  isMissing,
  getValue,
} from "utils";

test("toType object", () => {
  expect(toType({})).toBe("object");
  expect(toType({ a: "A", b: "B" })).toBe("object");
  expect(isObject({})).toBe(true);
  expect(isObject({ a: "A", b: "B" })).toBe(true);

  expect(isObject([])).toBe(false);
  expect(isObject(new Date())).toBe(false);
});

test("toType array", () => {
  expect(toType([])).toBe("array");
  expect(toType(["1", 2])).toBe("array");
  expect(toType(new Array(5))).toBe("array");

  expect(isArray([])).toBe(true);
  expect(isArray(new Date())).toBe(false);
});

test("toType number", () => {
  expect(toType(123)).toBe("number");
  expect(toType(0)).toBe("number");
  expect(toType(1.234)).toBe("number");
});

test("toType number", () => {
  expect(toType("1234")).toBe("string");
  expect(toType("true")).toBe("string");
  expect(toType("a long string")).toBe("string");
  expect(toType(`a long string ${50}`)).toBe("string");
});

test("toType number", () => {
  const A = new Set([1, 2, 3]);
  const B = new Set([1, 2, 4]);
  expect(difference(A, B)).toEqual(new Set([3]));
});

test("missing ", () => {
  const missingCopy = JSON.parse(JSON.stringify(MISSING));
  const missing = MISSING;

  expect(isMissing(MISSING)).toBe(true);
  expect(isMissing(missing)).toBe(true);

  expect(isMissing(missingCopy)).toBe(false);
  expect(isMissing(1)).toBe(false);
  expect(isMissing("1234")).toBe(false);
  expect(isMissing(null)).toBe(false);
  expect(isMissing(undefined)).toBe(false);
  expect(isMissing([])).toBe(false);
  expect(isMissing({})).toBe(false);
});

test("getValue ", () => {
  expect(getValue(undefined, "a")).toBe(MISSING);
  expect(getValue(null, "a")).toBe(MISSING);
  expect(getValue({}, null)).toBe(MISSING);
  expect(getValue({}, undefined)).toBe(MISSING);

  expect(getValue({ a: "A", b: "B" }, "a")).toBe("A");
  expect(getValue({ a: "A", b: "B" }, "b")).toBe("B");
  expect(getValue({ a: "A", b: "B" }, "a", ["A"])).toBe(MISSING);
  expect(getValue({ a: "A", b: "B" }, "b", ["B"])).toBe(MISSING);
  expect(getValue({ a: "A", b: "B" }, "c")).toBe(MISSING);

  expect(getValue({ value: null }, "value")).toBe(null);
  expect(getValue({ value: undefined }, "value")).toBe(MISSING);
  expect(getValue({ value: null }, "value", [null])).toBe(MISSING);
  expect(getValue({ value: undefined }, "value", [])).toBe(undefined);
});
