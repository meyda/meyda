import nodePolyfills from "rollup-plugin-node-polyfills";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "./src/main.ts",
  output: {
    file: "./assets/main.js",
    format: "iife",
    name: "meydaDemo",
  },
  plugins: [
    nodePolyfills(),
    nodeResolve({
      browser: true,
    }),
    commonjs(),
    typescript(),
    terser(),
  ],
};
