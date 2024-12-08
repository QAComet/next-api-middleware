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

[types.ts:36](https://github.com/QAComet/next-api-middleware/blob/18b41491bdcc5fd6e62b3d4a669b5da625b229b4/src/types.ts#L36)
