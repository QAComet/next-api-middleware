**@qacomet/next-api-middleware**

***

<p align="center">
  <h1 align="center">Next.js App Router API Middleware</h1>
</p>

## Introduction

> ⚠️ **This library was written to support API routes using the Next.js [App Router](https://nextjs.org/docs/app). It was not written with the [Page Router](https://nextjs.org/docs/pages) in mind.**

The [Next.js App router](https://nextjs.org/docs/app) was introduced in Next.js 14, providing a new way to structure your Next.js applications. Unfortunately, their standard middleware is limited because

- The code executed in the middleware file is run in a [special environment built for edge-functions](https://nextjs.org/docs/pages/building-your-application/routing/middleware#runtime). This [limits the kinds of node modules](https://nextjs.org/docs/app/api-reference/edge#unsupported-apis) you can use, such as preventing you from using standard redis clients.
- It is difficult to split up multiple middleware into separate files using their standard interface

This library provides a robust middleware solution that lets you easily integrate middleware into your API routes. Some features include:

- The ability to centralize the registration of middleware
- Exclude middleware on your routes
- Integrates well with app router API routes
- Provides a [fluent API](https://en.wikipedia.org/wiki/Fluent_interface) for interacting with the library

## Getting started

Creating your middleware is a simple three-step process. You just create a middleware file containing the middleware you'd like to register, export the corresponding `RouteBuilder` that includes your middleware, import it in your `routes.ts` files, and build your routes with the `RouteBuilder`. We provide an example below illustrating how to use its fluent interface with your API routes.

### Install library

```sh
npm i @qacomet/next-api-middleware
```

### Create a middleware file

```ts
// Located in app/middleware/index.ts
import { RouteMiddleware, type Middleware } from "@qacomet/next-api-middleware";

const CaptureErrorsMiddleware: Middleware = async (req: NextRequest, next) => {
  try {
    // Catch any errors that are thrown in remaining
    // middleware and the API route handler
    return await next();
  } catch (err) {
    const eventId = Sentry.captureException(err);

    return NextResponse.json({ error: err }, { status: 500 });
  }
};

const AddRequestIdMiddleware: Middleware = async (req, res, next) => {
  // Let remaining middleware and API route execute
  const response = await next();

  // Apply header
  response.headers.set("X-Response-ID", nanoid());
  return response;
};

export const middleware = RouteMiddleware.from(
  CaptureErrorsMiddleware,
  AddRequestIdMiddleware
);
```

### Integrate middleware into your routes

```ts
// create API route
import { middleware } from "@/app/middleware";

const getHandler = async function (request: NextRequest) {
  return NextResponse.json({ message: "hello!" });
};

// create the exports from the middleware

export const { GET } = middleware
  .routes({ GET: getHandler })
  .exclude("AddRequestIdMiddleware")
  .build();
```

## Docs

For further reading, check out the `docs/` folder.
