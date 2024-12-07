[**@qacomet/next-api-middleware**](../../README.md)

***

[@qacomet/next-api-middleware](../../modules.md) / [types](../README.md) / MiddlewareFunction

# Type Alias: MiddlewareFunction()

> **MiddlewareFunction**: (`request`, `next`, `context`?, `handler`?) => `Promise`\<`NextResponse`\>

Describes the shape of middleware functions ingested by this library.

## Parameters

### request

`NextRequest`

### next

[`MiddlewareNextFunction`](MiddlewareNextFunction.md)

### context?

[`NextRouteHandlerContext`](NextRouteHandlerContext.md)

### handler?

[`NextRouteHandler`](NextRouteHandler.md)

## Returns

`Promise`\<`NextResponse`\>

## Defined in

[types.ts:32](https://github.com/QAComet/next-api-middleware/blob/6739ab5271f3727ce92c719bfebcda9983182dd7/src/types.ts#L32)
