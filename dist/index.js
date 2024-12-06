var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/route-builder.ts
var RouteBuilder = class {
  constructor(middleware, routes) {
    __publicField(this, "_middleware", []);
    __publicField(this, "_excludeList", []);
    __publicField(this, "_includeList", []);
    __publicField(this, "_routes");
    this._middleware = middleware;
    this._routes = routes;
  }
  /**
  * Constructs in instance of RouteBuilder with the configured middleware and routes.
  * @param middleware list of middleware this RouteBuilder instance will use
  * @param routes list of routes this RouteBuilder instance will use
  */
  static from(middleware, routes) {
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
  build(routes) {
    routes = routes || this._routes;
    const handlers = {};
    Object.entries(routes).forEach(([method, handler]) => {
      handlers[method] = this._compose(method, handler);
    });
    return handlers;
  }
  /**
  * Enables middleware to be included if they are excluded by default for
  * the current routes being built.
  * @param middlewareList list of middleware by name to use while wrapping
  * the routes
  */
  include(...middlewareList) {
    this._includeList = this._includeList.concat(middlewareList);
    return this;
  }
  /**
  * Excludes a list of middleware by name for a the current set of routes if
  * they are included by default.
  * @param middlwarelist list of middleware names to exclude from the routes
  * being built
  */
  exclude(...middlwarelist) {
    this._excludeList = this._excludeList.concat(middlwarelist);
    return this;
  }
  /**
  * Internal function that returns an array of middleware the current routes
  * being built will use.
  * @param method HTTP method for the handler the middleware is wrapping
  */
  _getRouteMiddleware(method) {
    return this._middleware.filter((config) => {
      if (!config.methods.includes(method)) {
        return false;
      }
      if (config.default.include) {
        return !this._excludeList.includes(config.name);
      } else if (config.default.exclude) {
        return this._includeList.includes(config.name);
      }
    }).map((m) => {
      return {
        name: m.name,
        function: m.middleware
      };
    });
  }
  /**
  * Internal function that composes the associated middleware together,
  * wrapping the original route handler.
  * @param method HTTP method for the API handler
  * @param handler API handler being wrapped
  */
  _compose(method, handler) {
    const middleware = this._getRouteMiddleware(method);
    const wrapper = /* @__PURE__ */ __name(async (i, request, context) => {
      if (i === middleware.length) {
        return await handler(request, context);
      }
      const nextFunction = /* @__PURE__ */ __name(async () => {
        return await wrapper(i + 1, request, context);
      }, "nextFunction");
      return middleware[i].function(request, nextFunction, context, handler);
    }, "wrapper");
    return async (request, context) => {
      return wrapper(0, request, context);
    };
  }
};
__name(RouteBuilder, "RouteBuilder");

// src/constants.ts
var DEFAULT_HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "HEAD"
];

// src/route-middleware.ts
var RouteMiddleware = class {
  constructor(middleware) {
    __publicField(this, "middleware");
    this.middleware = middleware;
  }
  /**
  * Constructs a RouteMiddleware instance from an array of middleware config
  * objects and middleware functions.
  * @param middleware list of middleware functions and middleware config objects
  */
  static from(...middleware) {
    const parsedMiddleware = middleware.map((m) => {
      if (typeof m === "function") {
        return {
          name: m.name,
          middleware: m,
          default: {
            include: true
          },
          methods: DEFAULT_HTTP_METHODS
        };
      } else {
        let methods = Array.from(new Set(m.methods));
        m.name = m.name || m.middleware.name;
        m.methods = methods.length > 0 ? methods : DEFAULT_HTTP_METHODS;
        m.default = m.default || {
          include: true
        };
        return m;
      }
    });
    return new RouteMiddleware(parsedMiddleware);
  }
  /**
  * Merges a list of RouteMiddleware instances to combine their middleware by
  * concatenation.
  * @param routeMiddleware
  */
  static merge(...routeMiddleware) {
    return new RouteMiddleware([]).merge(...routeMiddleware);
  }
  /**
  * Concatenates the middleware from a list of RouteMiddleware instances into
  * the current list of middleware
  * @param routeMiddleware
  */
  merge(...routeMiddleware) {
    this.middleware = this.middleware.concat(...routeMiddleware.map((m) => m.middleware));
    return this;
  }
  /**
  * Returns an instance of RouteBuilder containing the middleware configured
  * in this instance and the routes this middleware should be applied to.
  * @param routes object containing routes this RouteMiddleware instance
  * will wrap
  */
  routes(routes) {
    if (routes.hasOwnProperty("prototype")) {
      routes = new routes();
    }
    return RouteBuilder.from(this.middleware, routes);
  }
};
__name(RouteMiddleware, "RouteMiddleware");
export {
  RouteBuilder,
  RouteMiddleware
};
