import { NextResponse } from "next/server";
import { describe, expect, it } from "vitest";
import { RouteMiddleware } from "../route-middleware";
import type { NextRouteHandlers } from "../types";

describe("Make sure that various end to end flows of the library work correctly", () => {
  it("Should be able to use a class as a container for the routes.", async () => {
    class TestHandlers implements NextRouteHandlers {
      async GET() {
        return new NextResponse("It works!");
      }
    }
    const builder = RouteMiddleware.from().routes(TestHandlers);
    expect(builder).not.toBeUndefined();
    expect(builder._routes.GET).not.toBeUndefined();
    expect(builder._routes.POST).toBeUndefined();
  });
});
