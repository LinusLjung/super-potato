const mockedSuccessfulResult = {
  isAuthorized: true,
};
const mockedFailedResult = {
  isAuthorized: false,
};

jest.mock('@linusljung/google-auth', function () {
  return {
    validateJWT: jest.fn().mockResolvedValueOnce(mockedSuccessfulResult).mockResolvedValueOnce(mockedFailedResult),
  };
});

import { Request } from 'express';
import isAuthorized from '../is-authorized';

describe('isAuthorized()', () => {
  it('resolves true if the token exists and is valid', async () => {
    const request = {
      session: {
        auth: {
          id_token: 'id_token',
        },
      },
    } as Request;

    const result = await isAuthorized(request);

    expect(result.isAuthorized).toEqual(mockedSuccessfulResult.isAuthorized);
  });
  it('resolves false if the token exists and is invalid', async () => {
    const request = {
      session: {
        auth: {
          id_token: 'id_token',
        },
      },
    } as Request;

    const result = await isAuthorized(request);

    expect(result.isAuthorized).toEqual(mockedFailedResult.isAuthorized);
  });

  it('resolves false if the auth object is missing', async () => {
    const request = ({
      session: {},
    } as unknown) as Request;

    const result = await isAuthorized(request);

    expect(result.isAuthorized).toEqual(mockedFailedResult.isAuthorized);
  });
});
