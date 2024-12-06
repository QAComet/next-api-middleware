import type { NextRequest } from "next/server";
import type {
  NextRouteHandlers,
  NextRouteHandler,
  NextRouteHandlerContext,
  BuilderMiddlewareConfig,
  HttpMethod,
} from "./types";

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
export class RouteBuilder {
  _middleware = [] as BuilderMiddlewareConfig[];
  _excludeList = [] as string[];
  _includeList = [] as string[];
  _routes: NextRouteHandlers;

  constructor(
    middleware: BuilderMiddlewareConfig[],
    routes: NextRouteHandlers
  ) {
    this._middleware = middleware;
    this._routes = routes;
  }

  /**
   * Constructs in instance of RouteBuilder with the configured middleware and routes.
   * @param middleware list of middleware this RouteBuilder instance will use
   * @param routes list of routes this RouteBuilder instance will use
   */
  static from(
    middleware: BuilderMiddlewareConfig[],
    routes: NextRouteHandlers
  ): RouteBuilder {
    return new RouteBuilder(middleware, routes);
  }

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
  build(routes?: NextRouteHandlers): NextRouteHandlers {
    routes = routes || this._routes;
    const handlers = {} as NextRouteHandlers;
    Object.entries(routes).forEach(([method, handler]) => {
      handlers[method as keyof NextRouteHandlers] = this._compose(
        method as HttpMethod,
        handler
      );
    });
    return handlers;
  }

  /**
   * Enables middleware to be included if they are excluded by default for
   * the current routes being built.
   * @param middlewareList list of middleware by name to use while wrapping
   * the routes
   */
  include(...middlewareList: string[]) {
    this._includeList = this._includeList.concat(middlewareList);
    return this;
  }

  /**
   * Excludes a list of middleware by name for a the current set of routes if
   * they are included by default.
   * @param middlwarelist list of middleware names to exclude from the routes
   * being built
   */
  exclude(...middlwarelist: string[]) {
    this._excludeList = this._excludeList.concat(middlwarelist);
    return this;
  }

  /**
   * Internal function that returns an array of middleware the current routes
   * being built will use.
   * @param method HTTP method for the handler the middleware is wrapping
   */
  _getRouteMiddleware(method: HttpMethod) {
    return this._middleware
      .filter((config) => {
        if (!config.methods.includes(method)) {
          return false;
        }
        if (config.default.include) {
          return !this._excludeList.includes(config.name);
        } else if (config.default.exclude) {
          return this._includeList.includes(config.name);
        }
      })
      .map((m) => {
        return {
          name: m.name,
          function: m.middleware,
        };
      });
  }

  /**
   * Internal function that composes the associated middleware together,
   * wrapping the original route handler.
   * @param method HTTP method for the API handler
   * @param handler API handler being wrapped
   */
  _compose(method: HttpMethod, handler: NextRouteHandler): NextRouteHandler {
    const middleware = this._getRouteMiddleware(method);
    const wrapper = async (
      i: number,
      request: NextRequest,
      context?: NextRouteHandlerContext
    ) => {
      if (i === middleware.length) {
        return await handler(request, context);
      }
      const nextFunction = async () => {
        return await wrapper(i + 1, request, context);
      };
      return middleware[i].function(request, nextFunction, context, handler);
    };
    return (async (request: NextRequest, context?: NextRouteHandlerContext) => {
      return wrapper(0, request, context);
    }) as NextRouteHandler;
  }
}
