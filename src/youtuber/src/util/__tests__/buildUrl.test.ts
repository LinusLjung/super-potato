import { buildUrl } from '../buildUrl';

describe('buildUrl()', () => {
  it('should build a url with passed query params', () => {
    expect(
      buildUrl('http://localhost', {
        query1: 'value1',
        query2: 'value2',
        query3: '',
        query4: void 0,
        query5: ['value3', 'value4'],
      }),
    ).toBe('http://localhost/?query1=value1&query2=value2&query3=&query5=value3&query5=value4');
  });
});
