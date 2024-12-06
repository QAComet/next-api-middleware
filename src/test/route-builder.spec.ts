import { NextRequest, NextResponse } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { RouteBuilder, type NextRouteHandler } from "../index";
import { createMiddlewareConfig } from "./utils";

describe("RouteBuilder", () => {
  it("Executes middleware in the correct order", async () => {
    const log = [] as string[];
    const routes = {
      GET: vi.fn((req, context) => {
        log.push("GET route");
        return NextResponse.json({ message: "success" });
      }) as unknown as NextRouteHandler,
    };
    const middleware = [
      createMiddlewareConfig(
        "MiddlewareA",
        vi.fn(async (req, next) => {
          log.push("start middleware A");
          const resp = await next();
          log.push("end middleware A");
          return resp;
        })
      ),
      createMiddlewareConfig(
        "MiddlewareB",
        vi.fn(async (req, next) => {
          log.push("start middleware B");
          const resp = await next();
          log.push("end middleware B");
          return resp;
        })
      ),
      createMiddlewareConfig(
        "MiddlewareC",
        vi.fn(async (req, next) => {
          log.push("start middleware C");
          const resp = await next();
          log.push("end middleware C");
          return resp;
        })
      ),
    ];

    const routeBuilder = RouteBuilder.from(middleware, routes);
    const { GET } = routeBuilder.build();

    const request = new NextRequest("http://test.example.com/", {
      method: "GET",
    });

    await GET!(request);

    expect(middleware[0].middleware).toBeCalled();
    expect(middleware[1].middleware).toBeCalled();
    expect(middleware[2].middleware).toBeCalled();
    expect(log.toString()).toBe(
      [
        "start middleware A",
        "start middleware B",
        "start middleware C",
        "GET route",
        "end middleware C",
        "end middleware B",
        "end middleware A",
      ].toString()
    );
  });

  it("Correctly sends context between middleware and to the handler being wrapper", async () => {
    const log = [] as string[];
    const routes = {
      GET: vi.fn((req, context) => {
        log.push(
          `GET route - ${context.params.post_id} - ${context.params.comment_id}`
        );
        return NextResponse.json({ message: "success" });
      }) as unknown as NextRouteHandler,
    };
    const middleware = [
      createMiddlewareConfig(
        "MiddlewareA",
        vi.fn(async (req, next, context) => {
          log.push(
            `middlewareA - ${context.params.post_id} - ${context.params.comment_id}`
          );
          const resp = await next();

          return resp;
        })
      ),
      createMiddlewareConfig(
        "MiddlewareB",
        vi.fn(async (req, next, context) => {
          log.push(
            `middlewareB - ${context.params.post_id} - ${context.params.comment_id}`
          );
          const resp = await next();
          return resp;
        })
      ),
    ];

    const routeBuilder = RouteBuilder.from(middleware, routes);
    const { GET } = routeBuilder.build();

    const request = new NextRequest("http://test.example.com/", {
      method: "GET",
    });

    const context = {
      params: {
        post_id: "my-test-post",
        comment_id: "my-comment-id",
      },
    };

    await GET!(request, context);

    expect(middleware[0].middleware).toBeCalled();
    expect(middleware[1].middleware).toBeCalled();
    expect(log.toString()).toBe(
      [
        `middlewareA - ${context.params.post_id} - ${context.params.comment_id}`,
        `middlewareB - ${context.params.post_id} - ${context.params.comment_id}`,
        `GET route - ${context.params.post_id} - ${context.params.comment_id}`,
      ].toString()
    );
  });

  it("Short circuits the middleware chain if an earlier piece of middleware returns a response", async () => {
    const log: string[] = [];
    const routes = {
      GET: vi.fn((req, context) => {
        log.push("GET route");
        return NextResponse.json({ message: "success" });
      }) as unknown as NextRouteHandler,
    };
    const middleware = [
      createMiddlewareConfig(
        "MiddlewareA",
        vi.fn(async (req, next) => {
          log.push("start middleware A");
          const resp = await next();
          log.push("end middleware A");
          return resp;
        })
      ),
      createMiddlewareConfig(
        "MiddlewareB",
        vi.fn(async (req, next) => {
          log.push("start middleware B");
          return NextResponse.json({ hello: "world" });
        })
      ),
      createMiddlewareConfig(
        "MiddlewareC",
        vi.fn(async (req, next) => {
          log.push("start middleware C");
          const resp = await next();
          log.push("end middleware C");
          return resp;
        })
      ),
    ];
    const routeBuilder = RouteBuilder.from(middleware, routes);
    const { GET } = routeBuilder.build();

    const request = new NextRequest("http://test.example.com/", {
      method: "GET",
    });

    await GET!(request);
    expect(middleware[0].middleware).toBeCalled();
    expect(middleware[1].middleware).toBeCalled();
    expect(middleware[2].middleware).not.toBeCalled();
    expect(log.toString()).toBe(
      [
        "start middleware A",
        "start middleware B",
        "end middleware A",
      ].toString()
    );
  });

  it("Excludes a middleware configured to be included but added to the exclude list", async () => {
    const log: string[] = [];
    const routes = {
      GET: vi.fn((req, context) => {
        log.push("GET route");
        return NextResponse.json({ message: "success" });
      }) as unknown as NextRouteHandler,
    };

    const MiddlewareB = vi.fn(async (req, next) => {
      log.push("start middleware B");
      const resp = await next();
      log.push("end middleware B");
      return resp;
    });

    const middleware = [
      createMiddlewareConfig(
        "MiddlewareA",
        vi.fn(async (req, next) => {
          log.push("start middleware A");
          const resp = await next();
          log.push("end middleware A");
          return resp;
        })
      ),
      createMiddlewareConfig(
        "MiddlewareB",
        async function (req: any, next: any) {
          return await MiddlewareB(req, next);
        }
      ),
      createMiddlewareConfig(
        "MiddlewareC",
        vi.fn(async (req, next) => {
          log.push("start middleware C");
          const resp = await next();
          log.push("end middleware C");
          return resp;
        })
      ),
    ];

    const routeBuilder = RouteBuilder.from(middleware, routes);
    const { GET } = routeBuilder.exclude("MiddlewareB").build();

    const request = new NextRequest("http://test.example.com/", {
      method: "GET",
    });

    await GET!(request);

    expect(middleware[0].middleware).toBeCalled();
    expect(MiddlewareB).not.toBeCalled();
    expect(middleware[2].middleware).toBeCalled();
    expect(log.toString()).toBe(
      [
        "start middleware A",
        "start middleware C",
        "GET route",
        "end middleware C",
        "end middleware A",
      ].toString()
    );
  });

  it("Excludes a middleware configured to be excluded", async () => {
    const log = [] as string[];
    const routes = {
      GET: vi.fn((req, context) => {
        log.push("GET route");
        return NextResponse.json({ message: "success" });
      }) as unknown as NextRouteHandler,
    };
    const MiddlewareB = vi.fn(async (req, next) => {
      log.push("start middleware B");
      const resp = await next();
      log.push("end middleware B");
      return resp;
    });
    const middleware = [
      createMiddlewareConfig(
        "MiddlewareA",
        vi.fn(async (req, next) => {
          log.push("start middleware A");
          const resp = await next();
          log.push("end middleware A");
          return resp;
        })
      ),
      createMiddlewareConfig("MiddlewareB", async function (req, next) {
        return await MiddlewareB(req, next);
      }),
      createMiddlewareConfig(
        "MiddlewareC",
        vi.fn(async (req, next) => {
          log.push("start middleware C");
          const resp = await next();
          log.push("end middleware C");
          return resp;
        })
      ),
    ];

    middleware[1].default = { exclude: true };

    const routeBuilder = RouteBuilder.from(middleware, routes);
    const { GET } = routeBuilder.build();

    const request = new NextRequest("http://test.example.com/", {
      method: "GET",
    });

    await GET!(request);

    expect(middleware[0].middleware).toBeCalled();
    expect(MiddlewareB).not.toBeCalled();
    expect(middleware[2].middleware).toBeCalled();
    expect(log.toString()).toBe(
      [
        "start middleware A",
        "start middleware C",
        "GET route",
        "end middleware C",
        "end middleware A",
      ].toString()
    );
  });

  it("Includes a middleware configured to be excluded but set on the builder's include list", async () => {
    const log = [] as string[];
    const routes = {
      GET: vi.fn((req, context) => {
        log.push("GET route");
        return NextResponse.json({ message: "success" });
      }) as unknown as NextRouteHandler,
    };
    const MiddlewareB = vi.fn(async (req, next) => {
      log.push("start middleware B");
      const resp = await next();
      log.push("end middleware B");
      return resp;
    });
    const middleware = [
      createMiddlewareConfig(
        "MiddlewareA",
        vi.fn(async (req, next) => {
          log.push("start middleware A");
          const resp = await next();
          log.push("end middleware A");
          return resp;
        })
      ),
      createMiddlewareConfig("MiddlewareB", async function (req, next) {
        return await MiddlewareB(req, next);
      }),
      createMiddlewareConfig(
        "MiddlewareC",
        vi.fn(async (req, next) => {
          log.push("start middleware C");
          const resp = await next();
          log.push("end middleware C");
          return resp;
        })
      ),
    ];

    middleware[1].default = { exclude: true };

    const routeBuilder = RouteBuilder.from(middleware, routes);
    const { GET } = routeBuilder.include("MiddlewareB").build();

    const request = new NextRequest("http://test.example.com/", {
      method: "GET",
    });

    await GET!(request);

    expect(middleware[0].middleware).toBeCalled();
    expect(MiddlewareB).toBeCalled();
    expect(middleware[2].middleware).toBeCalled();
    expect(log.toString()).toBe(
      [
        "start middleware A",
        "start middleware B",
        "start middleware C",
        "GET route",
        "end middleware C",
        "end middleware B",
        "end middleware A",
      ].toString()
    );
  });

  it("Middleware not configured for a specific HTTP method should not be called", async () => {
    const log = [] as string[];
    const routes = {
      GET: vi.fn((req, context) => {
        log.push("GET route");
        return NextResponse.json({ message: "success" });
      }) as unknown as NextRouteHandler,
    };
    const MiddlewareB = vi.fn(async (req, next) => {
      log.push("start middleware B");
      const resp = await next();
      log.push("end middleware B");
      return resp;
    });
    const middleware = [
      createMiddlewareConfig(
        "MiddlewareA",
        vi.fn(async (req, next) => {
          log.push("start middleware A");
          const resp = await next();
          log.push("end middleware A");
          return resp;
        })
      ),
      createMiddlewareConfig("MiddlewareB", async function (req, next) {
        return await MiddlewareB(req, next);
      }),
      createMiddlewareConfig(
        "MiddlewareC",
        vi.fn(async (req, next) => {
          log.push("start middleware C");
          const resp = await next();
          log.push("end middleware C");
          return resp;
        })
      ),
    ];

    middleware[1].methods = ["POST", "PUT", "DELETE"];

    const routeBuilder = RouteBuilder.from(middleware, routes);
    const { GET } = routeBuilder.build();

    const request = new NextRequest("http://test.example.com/", {
      method: "GET",
    });

    await GET!(request);

    expect(middleware[0].middleware).toBeCalled();
    expect(MiddlewareB).not.toBeCalled();
    expect(middleware[2].middleware).toBeCalled();
    expect(log.toString()).toBe(
      [
        "start middleware A",
        "start middleware C",
        "GET route",
        "end middleware C",
        "end middleware A",
      ].toString()
    );
  });
});
