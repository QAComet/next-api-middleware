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

[types.ts:32](https://github.com/QAComet/next-api-middleware/blob/1c65ba86d75ce5f9f421c416d51a423d428d8e19/src/types.ts#L32)
