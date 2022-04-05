/// <reference types="@types/jest" />

const { Response } = jest.requireActual('node-fetch') as typeof import('node-fetch');

const response = new Response(JSON.stringify({ hello: 'world' }));
const nodeFetch = jest.fn().mockResolvedValue(response);

export default nodeFetch;
