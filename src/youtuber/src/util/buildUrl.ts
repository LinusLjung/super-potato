import { Request } from 'express';

export function buildUrl(base: string, queryParams: Request['query'] = {}) {
  const url = new URL(base);

  Object.entries(queryParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      return url.searchParams.append(key, value);
    }

    if (value instanceof Array) {
      (value as string[]).forEach((value) => url.searchParams.append(key, value));
    }
  });

  return url.toString();
}
