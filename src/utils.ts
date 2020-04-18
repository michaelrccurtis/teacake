export const toType = (obj: any) => ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
export const isObject = (obj: any) => toType(obj) === "object";
export const isArray = (obj: any) => toType(obj) === "array";

export const difference = <A>(setA: Set<A>, setB: Set<A>): Set<A> => {
    let _difference = new Set(setA)
    for (let elem of setB) {
        _difference.delete(elem)
    }
    return _difference
}

export const MISSING = {'SOMETHING_IS' : 'MISSING'};
export const isMissing = (value: any) => Object.is(value, MISSING);

export const getValue = (obj: any, attr: any, ignore: any[] = [undefined]) => {
  if (obj === null || obj === undefined) {
    return MISSING;
  }
  const value = obj[attr];
  if (ignore.includes(value)) {
    return MISSING;
  }
  return value;
}

