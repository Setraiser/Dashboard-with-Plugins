import "@testing-library/jest-dom";

class MockResponse {
  status: number;
  body: unknown;

  constructor(body?: unknown, init: { status?: number } = {}) {
    this.body = body;
    this.status = init.status ?? 200;
  }

  static json(body: unknown, init: { status?: number } = {}) {
    return new MockResponse(body, init);
  }

  async json() {
    return this.body;
  }
}

if (!globalThis.Request) {
  // @ts-expect-error - test polyfill for route handlers in Jest
  globalThis.Request = class Request {
    url: string;
    method: string;
    body?: string;

    constructor(input: string | URL, init: RequestInit = {}) {
      this.url = String(input);
      this.method = init.method ?? "GET";
      this.body = typeof init.body === "string" ? init.body : undefined;
    }

    async json() {
      return this.body ? JSON.parse(this.body) : {};
    }
  };
}

if (!globalThis.Response) {
  // @ts-expect-error - test polyfill for route handlers in Jest
  globalThis.Response = MockResponse;
}
