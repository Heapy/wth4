const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = function (options = {}) {
  // Settings
  // --env.NODE_ENV root --env.SOURCE_MAP source-map ...
  const NODE_ENV = options.NODE_ENV;
  const SOURCE_MAP = options.SOURCE_MAP;
  const DIST = options.DIST || path.resolve(__dirname, "dist");
  const APP = path.resolve(__dirname, "app");

  // Log as error, so this will not be part of stats.json.
  console.error(`
Build started with following configuration:
===========================================
→ NODE_ENV: ${NODE_ENV}
→ SOURCE_MAP: ${SOURCE_MAP}
→ DIST: ${DIST}
`);

  return {
    mode: NODE_ENV,
    entry: path.resolve(APP, "src", "main.tsx"),
    output: {
      path: DIST,
      filename: "[name].js?[hash]",
      publicPath: "/"
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"]
    },
    bail: false,
    devtool: SOURCE_MAP,
    module: {
      rules: [{
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader"
      }, {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }, {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "url-loader",
        options: {
          limit: 32768
        }
      }]
    },
    optimization: {
      splitChunks: {
        chunks: "all"
      }
    },
    plugins: createListOfPlugins()
  };

  function createListOfPlugins() {
    return [
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: path.resolve(APP, "index.html"),
        favicon: path.resolve(APP, "favicon.png"),
        hash: true
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
      new webpack.DefinePlugin({
        "process.env": {
          "NODE_ENV": JSON.stringify(NODE_ENV)
        }
      })
    ];
  }
};

