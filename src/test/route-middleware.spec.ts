import { NextResponse } from "next/server";
import { describe, expect, it } from "vitest";
import { RouteMiddleware, type Middleware } from "../index";
import { DEFAULT_HTTP_METHODS } from "../constants";

describe("RouteMiddleware", () => {
  it("Should be able to merge multiple RouteMiddleware instances together.", async () => {
    async function MiddlewareA(req: any, next: any) {
      return NextResponse.json({ message: "success" });
    }
    async function MiddlewareB(req: any, next: any) {
      return NextResponse.json({ message: "success" });
    }
    async function MiddlewareC(req: any, next: any) {
      return NextResponse.json({ message: "success" });
    }
    const routerA = RouteMiddleware.from(
      MiddlewareA as Middleware,
      MiddlewareB as Middleware
    );
    const routerB = RouteMiddleware.from(MiddlewareC as Middleware);
    const routerC = RouteMiddleware.merge(routerA, routerB);

    expect(routerC.middleware.length).toBe(3);
    expect(routerC.middleware[0].name).toBe("MiddlewareA");
    expect(routerC.middleware[1].name).toBe("MiddlewareB");
    expect(routerC.middleware[2].name).toBe("MiddlewareC");

    routerA.merge(routerB);
    expect(routerA.middleware.length).toBe(3);
    expect(routerA.middleware[0].name).toBe("MiddlewareA");
    expect(routerA.middleware[1].name).toBe("MiddlewareB");
    expect(routerA.middleware[2].name).toBe("MiddlewareC");
  });

  it("Should not override configured HTTP methods", async () => {
    const MiddlewareA = {
      middleware: async function MiddlewareA(req: any, next: any) {
        return NextResponse.json({ message: "success" });
      },
      methods: ["GET"],
    };
    const routeMiddleware = RouteMiddleware.from(MiddlewareA as Middleware);
    expect(routeMiddleware.middleware[0].methods.length).toBe(1);
    expect(routeMiddleware.middleware[0].methods[0]).toBe("GET");
  });

  it("Should add default functionality to middleware configs", async () => {
    const MiddlewareConfig = {
      middleware: async function MiddlewareA(req: any, next: any) {
        return NextResponse.json({ message: "success" });
      },
    };
    const routeMiddleware = RouteMiddleware.from(
      MiddlewareConfig as Middleware
    );
    expect(routeMiddleware.middleware.length).toBe(1);
    const m = routeMiddleware.middleware[0];
    console.log("m", m);
    expect(m.default).toHaveProperty("include");
    expect(m.default.include).toBe(true);
    expect(m.default).not.toHaveProperty("exclude");
    expect(m.name).toBe("MiddlewareA");
    expect(m.methods.toString()).toBe(DEFAULT_HTTP_METHODS.toString());
  });
});
