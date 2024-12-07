[**@qacomet/next-api-middleware**](../../README.md)

***

[@qacomet/next-api-middleware](../../modules.md) / [route-middleware](../README.md) / RouteMiddleware

# Class: RouteMiddleware

Main interface for interacting with this library. This class is responsible
for keeping track of middleware that can be applied to routes, and can
construct an instance of the RouteBuilder class for an object containing
the corresponding route handlers.

Here's an example demonstrating typical usage while also showing off the
various features supported by this middleware library.
```ts
// app/middleware/index.ts

import { RouteMiddleware } from "@qacomet/next-api-middleware";
import { XFrameMiddleware } from "./x-frame";
import { XSRFMiddleware } from "./xsrf";
import { SessionMiddleware } from "./session";
import { AdminAuthMiddleware } from "./auth/admin";
import { AuthMiddleware } from "./auth";

export const middleware = RouteMiddleware.from([
  XFrameMiddleware,
  {
    middleware: XSRFMiddleware,
    default: { include: true },
    methods: ["POST", "PUT", "PATCH"]
  },
  { name: "SessionMiddleware", middleware: SessionMiddleware },
  {
    name: "SecretAuthMiddleware",
    middleware: AdminAuthMiddleware,
    default: { exclude: true }
  },
  {
    name: "AuthMiddleware",
    middleware: AuthMiddleware,
    default: { include: true }
  },
]);

export default middleware;

// app/some/page/routes.ts
import { middleware } from '@app/middleware';

async function getHandler () {
  // implement
}

class DataHandlers implements NextRouteHandlers {
  async function POST () {
    // implement
  }

  async function PUT () {
    // implement
  }

  async function DELETE () {
    // implement
  }
}

export const { GET } = middleware.routes({
  GET: getHandler
})
  .include("SecretAuthMiddleware")
  .build();
export const { POST, PUT, DELETE } = middleware.routes({
  POST: postHandler,
  PUT: putHandler,
  DELETE: deleteHandler,
}).include("SecretAuthMiddleware")
  .exclude("AuthMiddleware")
  .build();
```

## Constructors

### new RouteMiddleware()

> **new RouteMiddleware**(`middleware`): [`RouteMiddleware`](RouteMiddleware.md)

Note: it's not recommended to use this constructor yourself, instead call
`RouteMiddleware.from` so that it can set the default values required in
the middleware config objects.

#### Parameters

##### middleware

[`BuilderMiddlewareConfig`](../../types/type-aliases/BuilderMiddlewareConfig.md)[]

list of middleware configs using the internal
middleware config interface

#### Returns

[`RouteMiddleware`](RouteMiddleware.md)

#### Defined in

[route-middleware.ts:96](https://github.com/QAComet/next-api-middleware/blob/3a5114602cac5b5b5beddb1f0725ccefe957f2a6/src/route-middleware.ts#L96)

## Properties

### middleware

> **middleware**: [`BuilderMiddlewareConfig`](../../types/type-aliases/BuilderMiddlewareConfig.md)[]

#### Defined in

[route-middleware.ts:87](https://github.com/QAComet/next-api-middleware/blob/3a5114602cac5b5b5beddb1f0725ccefe957f2a6/src/route-middleware.ts#L87)

## Methods

### merge()

> **merge**(...`routeMiddleware`): [`RouteMiddleware`](RouteMiddleware.md)

Concatenates the middleware from a list of RouteMiddleware instances into
the current list of middleware

#### Parameters

##### routeMiddleware

...[`RouteMiddleware`](RouteMiddleware.md)[]

#### Returns

[`RouteMiddleware`](RouteMiddleware.md)

#### Defined in

[route-middleware.ts:142](https://github.com/QAComet/next-api-middleware/blob/3a5114602cac5b5b5beddb1f0725ccefe957f2a6/src/route-middleware.ts#L142)

***

### routes()

> **routes**(`routes`): [`RouteBuilder`](../../route-builder/classes/RouteBuilder.md)

Returns an instance of RouteBuilder containing the middleware configured
in this instance and the routes this middleware should be applied to.

#### Parameters

##### routes

object containing routes this RouteMiddleware instance
will wrap

[`NextRouteHandlers`](../../types/interfaces/NextRouteHandlers.md) | [`NextRouteHandlersClass`](../../types/type-aliases/NextRouteHandlersClass.md)

#### Returns

[`RouteBuilder`](../../route-builder/classes/RouteBuilder.md)

#### Defined in

[route-middleware.ts:155](https://github.com/QAComet/next-api-middleware/blob/3a5114602cac5b5b5beddb1f0725ccefe957f2a6/src/route-middleware.ts#L155)

***

### from()

> `static` **from**(...`middleware`): [`RouteMiddleware`](RouteMiddleware.md)

Constructs a RouteMiddleware instance from an array of middleware config
objects and middleware functions.

#### Parameters

##### middleware

...[`Middleware`](../../types/type-aliases/Middleware.md)[]

list of middleware functions and middleware config
objects

#### Returns

[`RouteMiddleware`](RouteMiddleware.md)

#### Defined in

[route-middleware.ts:106](https://github.com/QAComet/next-api-middleware/blob/3a5114602cac5b5b5beddb1f0725ccefe957f2a6/src/route-middleware.ts#L106)

***

### merge()

> `static` **merge**(...`routeMiddleware`): [`RouteMiddleware`](RouteMiddleware.md)

Merges a list of RouteMiddleware instances to combine their middleware by
concatenation.

#### Parameters

##### routeMiddleware

...[`RouteMiddleware`](RouteMiddleware.md)[]

#### Returns

[`RouteMiddleware`](RouteMiddleware.md)

#### Defined in

[route-middleware.ts:133](https://github.com/QAComet/next-api-middleware/blob/3a5114602cac5b5b5beddb1f0725ccefe957f2a6/src/route-middleware.ts#L133)
