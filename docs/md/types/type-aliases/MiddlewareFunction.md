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

[types.ts:32](https://github.com/QAComet/next-api-middleware/blob/3a5114602cac5b5b5beddb1f0725ccefe957f2a6/src/types.ts#L32)
