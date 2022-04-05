jest.mock('node-fetch');
jest.mock('../../util/parsers/channel');

import { NextFunction, Request, Response } from 'express';
import fetch from 'node-fetch';
import { CHANNEL_URL } from '../../consts';
import HttpError from '../../HttpError';
import { buildUrl } from '../../util/buildUrl';
import channelHandler, { handleChannelResponse, requiredQueryParams as requiredQueryParams } from '../channel';
const { Response: FetchResponse } = jest.requireActual('node-fetch') as typeof import('node-fetch');

function createMockRequest() {
  return {
    query: {},
  } as Request;
}

let mockRequest: Request;
const mockResponse = ({
  json: jest.fn().mockImplementation(() => mockResponse),
  status: jest.fn().mockImplementation(() => mockResponse),
  send: jest.fn().mockImplementation(() => mockResponse),
} as unknown) as Response;
const mockNext: NextFunction = jest.fn();

describe('channelHandler()', () => {
  beforeEach(() => {
    mockRequest = createMockRequest();
  });

  it('should fetch the requested channel', async () => {
    mockRequest.query = requiredQueryParams.reduce((acc, key, i) => ({ ...acc, [key]: `query${i}` }), {});

    await channelHandler(mockRequest, mockResponse, mockNext);

    expect(fetch).toHaveBeenCalledWith(buildUrl(CHANNEL_URL, mockRequest.query));
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });

  it('should handle unexpected errors', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(new Error());

    await channelHandler(mockRequest, mockResponse, mockNext);

    expect(fetch).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
  });

  it.each([400, 404])('should handle HTTP errors', async (errorCode) => {
    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(new HttpError(errorCode));

    await channelHandler(mockRequest, mockResponse, mockNext);

    expect(fetch).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(errorCode);
  });
});

describe('handleChannelResponse()', () => {
  it.each([[300], [401], [404], [500], [502]])('should handle non-200 responses', (status) => {
    const response = new FetchResponse('', {
      status,
    });

    expect(() => handleChannelResponse(response)).toThrowError(HttpError);
  });

  it('should handle 200 responses', async () => {
    const expectedValue = 'expected value';
    const response = new FetchResponse(expectedValue);

    expect(await handleChannelResponse(response)).toBe(expectedValue);
  });
});
