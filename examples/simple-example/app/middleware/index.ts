import { RouteMiddleware, type MiddlewareNextFunction } from "@qacomet/next-api-middleware";
import { NextRequest } from "next/server";

export const middleware = RouteMiddleware.from({
  name: 'TestMiddleware',
  middleware: async function (_req: NextRequest, next: MiddlewareNextFunction) {
    console.log("before");
    const resp = await next();
    console.log("after");
    return resp;
  }
});
