import asArray from '../asArray';

describe('asArray()', () => {
  it('should return the given array', () => {
    const input: any[] = [];

    expect(asArray(input)).toBe(input);
  });

  it('should wrap a non-array value in an array', () => {
    const input = 1;

    expect(asArray(input)).toEqual([input]);
  });

  it('should return an empty array if the input is `undefined`', () => {
    expect(asArray(void 0)).toBeInstanceOf(Array);
  });
});
