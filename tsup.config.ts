import { defineConfig, Options } from "tsup";

const options: Options = {
  entry: ["src/index.ts", "src/types.d.ts"],
  clean: true,
  sourcemap: false,
  dts: true,
  //dts: "src/types.d.ts",
  format: ["esm", "cjs"],
};
export default defineConfig(options);
/*
export default defineConfig([
  {
    ...shared,
    format: "esm",
    target: "node18",
    dts: true,
  },
  {
    ...shared,
    format: "cjs",
    target: "node18",
  },
]);
*/
