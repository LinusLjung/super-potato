class HttpError extends Error {
  code: number;

  constructor(code: number, ...superArgs: ConstructorParameters<typeof Error>) {
    super(...superArgs);

    this.name = 'HttpError';
    this.code = code;
  }
}

export default HttpError;
