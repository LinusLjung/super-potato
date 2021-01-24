function asArray<T>(value: T): T {
  if (typeof value === 'undefined') {
    return ([] as unknown) as T;
  }

  if (!Array.isArray(value)) {
    return ([value] as unknown) as T;
  }

  return value;
}

export default asArray;
