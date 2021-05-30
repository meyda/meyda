/* eslint-env es2021 */
import nodePolyfills from "rollup-plugin-node-polyfills";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import glob from "glob";
import typescript from "@rollup/plugin-typescript";

const SOURCE_FILES = glob.sync("src/**/*.ts");

const config = {
  input: "src/main.ts",
  output: {
    file: "dist/web/meyda.js",
    format: "umd",
    name: "Meyda",
    sourcemap: true,
  },
  plugins: [
    nodePolyfills(),
    nodeResolve({
      browser: true,
    }),
    commonjs(),
    typescript(),
    babel({ babelHelpers: "bundled" }),
  ],
};

function minified(config) {
  return Object.assign({}, config, {
    output: Object.assign({}, config.output, {
      file: config.output.file.replace(".js", ".min.js"),
    }),
    plugins: [...config.plugins, terser()],
  });
}

const NODE_CONFIGS = SOURCE_FILES.map((sourcefile) => ({
  input: sourcefile,
  output: {
    file: sourcefile.replace("src", "dist/node"),
    format: "cjs",
    exports: "auto",
  },
  plugins: [
    nodePolyfills(),
    nodeResolve(),
    typescript(),
    commonjs(),
    babel({ babelHelpers: "bundled" }),
  ],
}));

export default [config, minified(config), ...NODE_CONFIGS];
