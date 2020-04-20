import ErrorStore, { mergeErrors } from "errors";

test("adding errors", () => {
  const store = new ErrorStore();

  store.addError("ERROR_MESSAGE", "field");
  expect(store.errors).toEqual({ field: ["ERROR_MESSAGE"] });
  store.addError("ERROR_MESSAGE_2", "field");
  expect(store.errors).toEqual({ field: ["ERROR_MESSAGE", "ERROR_MESSAGE_2"] });

  store.addError("ERROR_MESSAGE_3", "field2");
  expect(store.errors).toEqual({
    field: ["ERROR_MESSAGE", "ERROR_MESSAGE_2"],
    field2: ["ERROR_MESSAGE_3"],
  });

  store.addError("ERROR_MESSAGE_4", 1);
  expect(store.errors).toEqual({
    1: ["ERROR_MESSAGE_4"],
    field: ["ERROR_MESSAGE", "ERROR_MESSAGE_2"],
    field2: ["ERROR_MESSAGE_3"],
  });
});

test("merging errors", () => {
  const store = new ErrorStore();

  expect(mergeErrors(undefined, undefined)).toEqual({});
  expect(mergeErrors(undefined, ['A'])).toEqual(['A']);
  expect(mergeErrors(['B'], undefined)).toEqual(['B']);
  expect(mergeErrors(['B'], ['A'])).toEqual(['B', 'A']);

  expect(mergeErrors({}, ['A'])).toEqual({ SCHEMA: ['A'] });
  expect(mergeErrors(['A'], {})).toEqual({ SCHEMA: ['A'] });

  expect(mergeErrors(['A'], { SCHEMA: ['B'] })).toEqual({ SCHEMA: ['B', 'A'] });
  expect(mergeErrors({ SCHEMA: ['B'] }, ['A'])).toEqual({ SCHEMA: ['B', 'A'] });

  expect(mergeErrors({ SCHEMA: ['B'] }, { A: ['ERROR'] })).toEqual({ A: ['ERROR'], SCHEMA: ['B'] });

});
