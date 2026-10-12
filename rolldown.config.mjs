import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/index.ts",
  external: ["coc.nvim"],
  platform: "node",
  resolve: { mainFields: ["module", "main"] },
  transform: { target: "node20" },
  output: {
    file: "lib/index.js",
    format: "cjs",
    minify: process.env.NODE_ENV === "production",
    sourcemap: process.env.NODE_ENV === "development",
  },
});
