import { Mock } from "vitest";
import { DEFAULT_HTTP_METHODS } from "../constants";
import type { BuilderMiddlewareConfig, MiddlewareFunction } from "../types";

export function createMiddlewareConfig(
  name: string,
  middleware: Mock<MiddlewareFunction> | MiddlewareFunction,
) {
  return {
    name,
    middleware: middleware as unknown as MiddlewareFunction,
    default: { include: true },
    methods: DEFAULT_HTTP_METHODS,
  } as BuilderMiddlewareConfig;
}
