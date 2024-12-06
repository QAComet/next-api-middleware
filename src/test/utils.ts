import { DEFAULT_HTTP_METHODS } from "../constants";
import type { BuilderMiddlewareConfig } from "../types";

export function createMiddlewareConfig(name: string, middleware: any) {
  return {
    name,
    middleware,
    default: { include: true },
    methods: DEFAULT_HTTP_METHODS,
  } as BuilderMiddlewareConfig;
}
