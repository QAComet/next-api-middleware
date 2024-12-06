import { type HttpMethods } from "./types";

/**
 * Default HTTP methods supported by Next.js
 */
export const DEFAULT_HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "HEAD",
] as HttpMethods;
