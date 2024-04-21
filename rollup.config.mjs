/* eslint-env es2021 */
import terser from "@rollup/plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import { glob } from "glob";

const plugins = [nodeResolve(), commonjs(), typescript()];

const SOURCE_FILES = glob
  .sync("src/**/*.ts")
  .filter((filename) => !filename.endsWith(".d.ts"));

const config = {
  input: "src/main.ts",
  output: {
    file: "dist/web/meyda.js",
    format: "umd",
    name: "Meyda",
    sourcemap: true,
  },
  plugins,
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
    file: sourcefile.replace("src", "dist/node").replace(".ts", ".js"),
    format: "cjs",
    exports: "auto",
  },
  plugins,
}));

export default [config, minified(config), ...NODE_CONFIGS];
