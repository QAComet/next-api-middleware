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

() => `Promise`\<`NextResponse`\>

### context?

[`NextRouteHandlerContext`](NextRouteHandlerContext.md)

### handler?

[`NextRouteHandler`](NextRouteHandler.md)

## Returns

`Promise`\<`NextResponse`\>

## Defined in

[types.ts:19](https://github.com/QAComet/next-api-middleware/blob/3366b8d2adaafc4e5dd18b77dbaa4989c3681903/src/types.ts#L19)
