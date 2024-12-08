import { middleware } from "@/app/middleware";
import { NextResponse } from "next/server";

class Handlers  {
  data: string
  constructor () {
    this.data = "Handlers data";
    this.GET = this.GET.bind(this);
  }

  async GET () {
    console.log("Instance<Handlers>.GET", this.data);
    return new NextResponse(`data: ${this.data}`);
  }
}

export const { GET } = middleware.routes(Handlers).build();