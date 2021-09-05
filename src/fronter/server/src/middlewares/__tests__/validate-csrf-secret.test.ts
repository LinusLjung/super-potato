import { Request, Response } from 'express';
import validateCsrfSecret from '../validate-csrf-secret';

describe('validateCsrfSecret()', () => {
  const mockedSecret = Math.random().toString();
  const mockedRequest = ({
    query: {
      state: mockedSecret,
    },
    session: {
      csrfSecret: mockedSecret,
    },
  } as unknown) as Request;
  const send = jest.fn();
  const status = jest.fn(() => mockedResponse);
  const next = jest.fn();
  const mockedResponse = ({
    status,
    send,
  } as unknown) as Response;

  it('should call next() if the secret is valid', async () => {
    await validateCsrfSecret(mockedRequest, mockedResponse, next);

    expect(next).toHaveBeenCalled();
  });

  it('should reject the request if the secret is invalid', async () => {
    mockedRequest.session.csrfSecret = '';

    await validateCsrfSecret(mockedRequest, mockedResponse, next);

    expect(next).not.toHaveBeenCalled();
  });
});
