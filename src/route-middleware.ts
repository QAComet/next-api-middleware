import type {
  Middleware,
  NextRouteHandlers,
  BuilderMiddlewareConfig,
  NextRouteHandlersClass,
} from "./types";
import { DEFAULT_HTTP_METHODS } from "./constants";

import { RouteBuilder } from "./route-builder";

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
export class RouteMiddleware {
  middleware: BuilderMiddlewareConfig[];

  /**
   * Note: it's not recommended to use this constructor yourself, instead call
   * `RouteMiddleware.from` so that it can set the default values required in
   * the middleware config objects.
   * @param middleware list of middleware configs using the internal
   * middleware config interface
   */
  constructor(middleware: BuilderMiddlewareConfig[]) {
    this.middleware = middleware;
  }

  /**
   * Constructs a RouteMiddleware instance from an array of middleware config
   * objects and middleware functions.
   * @param middleware list of middleware functions and middleware config
   * objects
   */
  static from(...middleware: Middleware[]) {
    const parsedMiddleware = middleware.map((m) => {
      if (typeof m === "function") {
        return {
          name: m.name,
          middleware: m,
          default: {
            include: true,
          },
          methods: DEFAULT_HTTP_METHODS,
        } as BuilderMiddlewareConfig;
      } else {
        let methods = Array.from(new Set(m.methods));
        m.name = m.name || m.middleware.name;
        m.methods = methods.length > 0 ? methods : DEFAULT_HTTP_METHODS;
        m.default = m.default || { include: true };
        return m as BuilderMiddlewareConfig;
      }
    });
    return new RouteMiddleware(parsedMiddleware);
  }

  /**
   * Merges a list of RouteMiddleware instances to combine their middleware by
   * concatenation.
   * @param routeMiddleware
   */
  static merge(...routeMiddleware: RouteMiddleware[]) {
    return new RouteMiddleware([]).merge(...routeMiddleware);
  }

  /**
   * Concatenates the middleware from a list of RouteMiddleware instances into
   * the current list of middleware
   * @param routeMiddleware
   */
  merge(...routeMiddleware: RouteMiddleware[]) {
    this.middleware = this.middleware.concat(
      ...routeMiddleware.map((m) => m.middleware)
    );
    return this;
  }

  /**
   * Returns an instance of RouteBuilder containing the middleware configured
   * in this instance and the routes this middleware should be applied to.
   * @param routes object containing routes this RouteMiddleware instance
   * will wrap
   */
  routes(routes: NextRouteHandlers | NextRouteHandlersClass) {
    // for if a class is used
    if (routes.hasOwnProperty("prototype")) {
      const routeHandlersInstance = new (routes as NextRouteHandlersClass)();
      const routeHandlers = {} as NextRouteHandlers;
      for (let method of DEFAULT_HTTP_METHODS) {
        if (routeHandlersInstance[method]) {
          routeHandlers[method] = routeHandlersInstance[method];
        }
      }
      routes = routeHandlers;
    }
    return RouteBuilder.from(this.middleware, routes as NextRouteHandlers);
  }
}
