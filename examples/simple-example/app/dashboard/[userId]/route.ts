import { middleware } from "@/app/middleware";
import { NextRequest, NextResponse } from "next/server";
import { type NextRouteHandlerContext } from "@qacomet/next-api-middleware";

const getHandler = async function (_request: NextRequest, context: NextRouteHandlerContext) {
  const params = await context!.params;
  console.log("getHandler")
  return new NextResponse(`params: ${JSON.stringify(params)}`);
}

export const { GET } = middleware.routes({ GET: getHandler }).build();

