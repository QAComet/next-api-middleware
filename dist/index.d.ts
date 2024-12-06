import * as next_server from 'next/server';
import { NextRequest } from 'next/server';

/**
 * Represents the context passed into an app API route by Next.js
 */
type NextRouteHandlerContext = {
    params: {
        [key: string]: string;
    };
};
/**
 * Represents an app API route handlers for Next.js
 */
type NextRouteHandler = (request?: NextRequest, context?: NextRouteHandlerContext) => Promise<next_server.NextResponse<unknown>>;
/**
 * Describes the shape of middleware functions ingested by this library.
 */
type MiddlewareFunction = (request: NextRequest, next: () => Promise<next_server.NextResponse<unknown>>, context?: NextRouteHandlerContext, handler?: NextRouteHandler) => Promise<next_server.NextResponse<unknown>>;
/**
 * Supported HTTP methods for Next.js route handlers
 */
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
/**
 * Used to configure the HTTP methods for middleware. Middleware config
 * defaults to all of them unless explicitly specified.
 */
type HttpMethods = HttpMethod[];
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
/**
 * Configuration format for middleware you input into the library.
 */
interface MiddlewareConfig {
    name?: string;
    middleware: MiddlewareFunction;
    methods?: HttpMethods;
    default?: XOR<{
        include: boolean;
    }, {
        exclude: boolean;
    }>;
}
/**
 * The external facing API ingests either a MiddlewareConfig or a MiddlewareFunction
 */
type Middleware = MiddlewareConfig | MiddlewareFunction;
/**
 * This is the internal type used for MiddlewareConfigs
 */
type BuilderMiddlewareConfig = MiddlewareConfig & Required<Pick<MiddlewareConfig, "name" | "default" | "methods">>;
/**
 * Interface defining the routes input into the middleware
 */
interface NextRouteHandlers {
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
type NextRouteHandlersClass = new () => NextRouteHandlers;

/**
 * This class is responsible for wrapping routes with the configured
 * middleware. Typically, `RouteMiddleware` will construct an instance of this
 * class with the `routes` method. So
 * ```ts
 * RouteMiddleware
 *   .register(middleware)
 *   .routes(routes);
 * ```
 * will return an instance of `RouteBuilder`. It is not recommended to use this
 * class yourself and instead depend on `RouteMiddleware` instead.
 */
declare class RouteBuilder {
    _middleware: BuilderMiddlewareConfig[];
    _excludeList: string[];
    _includeList: string[];
    _routes: NextRouteHandlers;
    constructor(middleware: BuilderMiddlewareConfig[], routes: NextRouteHandlers);
    /**
     * Constructs in instance of RouteBuilder with the configured middleware and routes.
     * @param middleware list of middleware this RouteBuilder instance will use
     * @param routes list of routes this RouteBuilder instance will use
     */
    static from(middleware: BuilderMiddlewareConfig[], routes: NextRouteHandlers): RouteBuilder;
    /**
     * Main builder function that wraps the handlers and returns an object that
     * can be exported. For example
     * ```ts
     * export const {
     *  GET, POST, DELETE
     * } = RouteBuilder
     *  .from(middleware, routes)
     *  .build();
     * ```
     * @param routes an object with keys the HTTP methods and values the route
     * handlers implementing the associated API functionality.
     */
    build(routes?: NextRouteHandlers): NextRouteHandlers;
    /**
     * Enables middleware to be included if they are excluded by default for
     * the current routes being built.
     * @param middlewareList list of middleware by name to use while wrapping
     * the routes
     */
    include(...middlewareList: string[]): this;
    /**
     * Excludes a list of middleware by name for a the current set of routes if
     * they are included by default.
     * @param middlwarelist list of middleware names to exclude from the routes
     * being built
     */
    exclude(...middlwarelist: string[]): this;
    /**
     * Internal function that returns an array of middleware the current routes
     * being built will use.
     * @param method HTTP method for the handler the middleware is wrapping
     */
    _getRouteMiddleware(method: HttpMethod): {
        name: string;
        function: MiddlewareFunction;
    }[];
    /**
     * Internal function that composes the associated middleware together,
     * wrapping the original route handler.
     * @param method HTTP method for the API handler
     * @param handler API handler being wrapped
     */
    _compose(method: HttpMethod, handler: NextRouteHandler): NextRouteHandler;
}

/**
 * Main interface for interacting with this library. This class is responsible
 * for keeping track of middleware that can be applied to routes, and can
 * construct an instance of the RouteBuilder class for an object containing
 * the corresponding route handlers.
 *
 * Here's an example demonstrating typical usage while also showing off the
 * various features supported by this middleware library.
 * ```ts
 * // app/middleware/index.ts
 *
 * import { RouteMiddleware } from "@qacomet/next-api-middleware";
 * import { XFrameMiddleware } from "./x-frame";
 * import { XSRFMiddleware } from "./xsrf";
 * import { SessionMiddleware } from "./session";
 * import { AdminAuthMiddleware } from "./auth/admin";
 * import { AuthMiddleware } from "./auth";
 *
 * export const middleware = RouteMiddleware.from([
 *   XFrameMiddleware,
 *   {
 *     middleware: XSRFMiddleware,
 *     default: { include: true },
 *     methods: ["POST", "PUT", "PATCH"]
 *   },
 *   { name: "SessionMiddleware", middleware: SessionMiddleware },
 *   {
 *     name: "SecretAuthMiddleware",
 *     middleware: AdminAuthMiddleware,
 *     default: { exclude: true }
 *   },
 *   {
 *     name: "AuthMiddleware",
 *     middleware: AuthMiddleware,
 *     default: { include: true }
 *   },
 * ]);
 *
 * export default middleware;
 *
 * // app/some/page/routes.ts
 * import { middleware } from '@app/middleware';
 *
 * async function getHandler () {
 *   // implement
 * }
 *
 * class DataHandlers implements NextRouteHandlers {
 *   async function POST () {
 *     // implement
 *   }
 *
 *   async function PUT () {
 *     // implement
 *   }
 *
 *   async function DELETE () {
 *     // implement
 *   }
 * }
 *
 * export const { GET } = middleware.routes({
 *   GET: getHandler
 * })
 *   .include("SecretAuthMiddleware")
 *   .build();
 * export const { POST, PUT, DELETE } = middleware.routes({
 *   POST: postHandler,
 *   PUT: putHandler,
 *   DELETE: deleteHandler,
 * }).include("SecretAuthMiddleware")
 *   .exclude("AuthMiddleware")
 *   .build();
 * ```
 */
declare class RouteMiddleware {
    middleware: BuilderMiddlewareConfig[];
    constructor(middleware: BuilderMiddlewareConfig[]);
    /**
     * Constructs a RouteMiddleware instance from an array of middleware config
     * objects and middleware functions.
     * @param middleware list of middleware functions and middleware config objects
     */
    static from(...middleware: Middleware[]): RouteMiddleware;
    /**
     * Merges a list of RouteMiddleware instances to combine their middleware by
     * concatenation.
     * @param routeMiddleware
     */
    static merge(...routeMiddleware: RouteMiddleware[]): RouteMiddleware;
    /**
     * Concatenates the middleware from a list of RouteMiddleware instances into
     * the current list of middleware
     * @param routeMiddleware
     */
    merge(...routeMiddleware: RouteMiddleware[]): this;
    /**
     * Returns an instance of RouteBuilder containing the middleware configured
     * in this instance and the routes this middleware should be applied to.
     * @param routes object containing routes this RouteMiddleware instance
     * will wrap
     */
    routes(routes: NextRouteHandlers | NextRouteHandlersClass): RouteBuilder;
}

export { BuilderMiddlewareConfig, HttpMethod, HttpMethods, Middleware, MiddlewareConfig, MiddlewareFunction, NextRouteHandler, NextRouteHandlerContext, NextRouteHandlers, NextRouteHandlersClass, RouteBuilder, RouteMiddleware };
