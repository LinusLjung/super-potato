import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import validateQueryParamsMiddleware from '../validateQueryParams';

function createMockRequest() {
  return {
    query: {},
  } as Request;
}

let mockRequest = createMockRequest();
const mockResponse = {
  status: (code) => mockResponse,
  send: (data) => mockResponse,
} as Response;
const mockNext: NextFunction = jest.fn();

describe('validateQueryMiddleware()', () => {
  afterEach(() => {
    jest.resetAllMocks();
    mockRequest = createMockRequest();
  });

  it('respond with an error code if a required query is missing', () => {
    const statusSpy = jest.spyOn(mockResponse, 'status');
    const sendSpy = jest.spyOn(mockResponse, 'send');

    mockRequest.query = {
      query1: 'query1',
    };

    validateQueryParamsMiddleware(['query1', 'missing', 'missing2'])(mockRequest, mockResponse, mockNext);
    expect(statusSpy).toHaveBeenCalledTimes(1);
    expect(statusSpy).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should accept the request if all required queries are present', () => {
    const statusSpy = jest.spyOn(mockResponse, 'status');
    const sendSpy = jest.spyOn(mockResponse, 'send');

    mockRequest.query = {
      query1: 'query1',
      query2: 'query2',
    };

    validateQueryParamsMiddleware(['query1', 'query2'])(mockRequest, mockResponse, mockNext);
    expect(statusSpy).not.toHaveBeenCalled();
    expect(sendSpy).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});
