[**@qacomet/next-api-middleware**](../../README.md)

***

[@qacomet/next-api-middleware](../../modules.md) / [route-builder](../README.md) / RouteBuilder

# Class: RouteBuilder

This class is responsible for wrapping routes with the configured
middleware. Typically, `RouteMiddleware` will construct an instance of this
class with the `routes` method. So
```ts
RouteMiddleware
  .register(middleware)
  .routes(routes);
```
will return an instance of `RouteBuilder`. It is not recommended to use this
class yourself and instead depend on `RouteMiddleware` instead.

## Constructors

### new RouteBuilder()

> **new RouteBuilder**(`middleware`, `routes`): [`RouteBuilder`](RouteBuilder.md)

Note: it's not recommended to use this constructor directly, instead it's
recommended to use the
`RouteMiddleware.from(...middleware).routes(routes)` interface to
construct a `RouteBuilder` object.

#### Parameters

##### middleware

[`BuilderMiddlewareConfig`](../../types/type-aliases/BuilderMiddlewareConfig.md)[]

list of middleware using the internal middleware config

##### routes

[`NextRouteHandlers`](../../types/interfaces/NextRouteHandlers.md)

object containing the route handlers

#### Returns

[`RouteBuilder`](RouteBuilder.md)

#### Defined in

[route-builder.ts:36](https://github.com/QAComet/next-api-middleware/blob/da24335f9b3ecf3283f97097a7779844efa72961/src/route-builder.ts#L36)

## Properties

### \_excludeList

> **\_excludeList**: `string`[]

#### Defined in

[route-builder.ts:24](https://github.com/QAComet/next-api-middleware/blob/da24335f9b3ecf3283f97097a7779844efa72961/src/route-builder.ts#L24)

***

### \_includeList

> **\_includeList**: `string`[]

#### Defined in

[route-builder.ts:25](https://github.com/QAComet/next-api-middleware/blob/da24335f9b3ecf3283f97097a7779844efa72961/src/route-builder.ts#L25)

***

### \_middleware

> **\_middleware**: [`BuilderMiddlewareConfig`](../../types/type-aliases/BuilderMiddlewareConfig.md)[]

#### Defined in

[route-builder.ts:23](https://github.com/QAComet/next-api-middleware/blob/da24335f9b3ecf3283f97097a7779844efa72961/src/route-builder.ts#L23)

***

### \_routes

> **\_routes**: [`NextRouteHandlers`](../../types/interfaces/NextRouteHandlers.md)

#### Defined in

[route-builder.ts:26](https://github.com/QAComet/next-api-middleware/blob/da24335f9b3ecf3283f97097a7779844efa72961/src/route-builder.ts#L26)

## Methods

### \_compose()

> **\_compose**(`method`, `handler`): [`NextRouteHandler`](../../types/type-aliases/NextRouteHandler.md)

Internal function that composes the associated middleware together,
wrapping the original route handler.

#### Parameters

##### method

[`HttpMethod`](../../types/type-aliases/HttpMethod.md)

HTTP method for the API handler

##### handler

[`NextRouteHandler`](../../types/type-aliases/NextRouteHandler.md)

API handler being wrapped

#### Returns

[`NextRouteHandler`](../../types/type-aliases/NextRouteHandler.md)

#### Defined in

[route-builder.ts:134](https://github.com/QAComet/next-api-middleware/blob/da24335f9b3ecf3283f97097a7779844efa72961/src/route-builder.ts#L134)

***

### \_getRouteMiddleware()

> **\_getRouteMiddleware**(`method`): `object`[]

Internal function that returns an array of middleware the current routes
being built will use.

#### Parameters

##### method

[`HttpMethod`](../../types/type-aliases/HttpMethod.md)

HTTP method for the handler the middleware is wrapping

#### Returns

`object`[]

#### Defined in

[route-builder.ts:108](https://github.com/QAComet/next-api-middleware/blob/da24335f9b3ecf3283f97097a7779844efa72961/src/route-builder.ts#L108)

***

### build()

> **build**(`routes`?): [`NextRouteHandlers`](../../types/interfaces/NextRouteHandlers.md)

Main builder function that wraps the handlers and returns an object that
can be exported. For example
```ts
export const {
 GET, POST, DELETE
} = RouteBuilder
 .from(middleware, routes)
 .build();
```

#### Parameters

##### routes?

[`NextRouteHandlers`](../../types/interfaces/NextRouteHandlers.md)

an object with keys the HTTP methods and values the route
handlers implementing the associated API functionality.

#### Returns

[`NextRouteHandlers`](../../types/interfaces/NextRouteHandlers.md)

#### Defined in

[route-builder.ts:69](https://github.com/QAComet/next-api-middleware/blob/da24335f9b3ecf3283f97097a7779844efa72961/src/route-builder.ts#L69)

***

### exclude()

> **exclude**(...`middlwarelist`): [`RouteBuilder`](RouteBuilder.md)

Excludes a list of middleware by name for a the current set of routes if
they are included by default.

#### Parameters

##### middlwarelist

...`string`[]

list of middleware names to exclude from the routes
being built

#### Returns

[`RouteBuilder`](RouteBuilder.md)

#### Defined in

[route-builder.ts:98](https://github.com/QAComet/next-api-middleware/blob/da24335f9b3ecf3283f97097a7779844efa72961/src/route-builder.ts#L98)

***

### include()

> **include**(...`middlewareList`): [`RouteBuilder`](RouteBuilder.md)

Enables middleware to be included if they are excluded by default for
the current routes being built.

#### Parameters

##### middlewareList

...`string`[]

list of middleware by name to use while wrapping
the routes

#### Returns

[`RouteBuilder`](RouteBuilder.md)

#### Defined in

[route-builder.ts:87](https://github.com/QAComet/next-api-middleware/blob/da24335f9b3ecf3283f97097a7779844efa72961/src/route-builder.ts#L87)

***

### from()

> `static` **from**(`middleware`, `routes`): [`RouteBuilder`](RouteBuilder.md)

Constructs in instance of RouteBuilder with the configured middleware and routes.

#### Parameters

##### middleware

[`BuilderMiddlewareConfig`](../../types/type-aliases/BuilderMiddlewareConfig.md)[]

list of middleware this RouteBuilder instance will use

##### routes

[`NextRouteHandlers`](../../types/interfaces/NextRouteHandlers.md)

list of routes this RouteBuilder instance will use

#### Returns

[`RouteBuilder`](RouteBuilder.md)

#### Defined in

[route-builder.ts:49](https://github.com/QAComet/next-api-middleware/blob/da24335f9b3ecf3283f97097a7779844efa72961/src/route-builder.ts#L49)
