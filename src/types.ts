/**
 * Represents the context passed into an app API route by Next.js since we
 * cannot import `AppRouteRouteHandlerContext` from next.js
 */
export type NextRouteHandlerContext = {
  params: Promise<undefined | Record<string, string | string[] | undefined>>;
};

/**
 * Represents an app API route handlers for Next.js
 */
export type NextRouteHandler = (
  request?: import("next/server").NextRequest,
  context?: NextRouteHandlerContext
) => Promise<import("next/server").NextResponse<unknown>>;

/**
 * Describes the shape of the next function passed into middleware functions.
 */
export type MiddlewareNextFunction = () => Promise<
  import("next/server").NextResponse<unknown>
>;

/**
 * Describes the shape of middleware functions ingested by this library.
 */
export type MiddlewareFunction = (
  request: import("next/server").NextRequest,
  next: MiddlewareNextFunction,
  context?: NextRouteHandlerContext,
  handler?: NextRouteHandler
) => Promise<import("next/server").NextResponse<unknown>>;

/**
 * Supported HTTP methods for Next.js route handlers
 */
export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

/**
 * Used to configure the HTTP methods for middleware. Middleware config
 * defaults to all of them unless explicitly specified.
 */
export type HttpMethods = HttpMethod[];

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

/**
 * Configuration format for middleware you input into the library.
 */
export interface MiddlewareConfig {
  name?: string;
  middleware: MiddlewareFunction;
  methods?: HttpMethods;
  default?: XOR<
    {
      include: boolean;
    },
    {
      exclude: boolean;
    }
  >;
}

/**
 * The external facing API ingests either a MiddlewareConfig or a MiddlewareFunction
 */
export type Middleware = MiddlewareConfig | MiddlewareFunction;

/**
 * This is the internal type used for MiddlewareConfigs
 */
export type BuilderMiddlewareConfig = MiddlewareConfig &
  Required<Pick<MiddlewareConfig, "name" | "default" | "methods">>;

/**
 * Interface defining the routes input into the middleware
 */
export interface NextRouteHandlers {
  GET?: NextRouteHandler;
  PUT?: NextRouteHandler;
  PATCH?: NextRouteHandler;
  POST?: NextRouteHandler;
  DELETE?: NextRouteHandler;
  HEAD?: NextRouteHandler;
  OPTIONS?: NextRouteHandler;
}

/**
 * Allows the API to inject either a class implementing the NextRouteHandlers
 * interface.
 */
export type NextRouteHandlersClass = new () => NextRouteHandlers;
