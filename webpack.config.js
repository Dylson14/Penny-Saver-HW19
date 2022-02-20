const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
  entry: "./public/index.js",
  output: {
    path: __dirname + "/public/dist",
    filename: "bundle.js",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new WebpackPwaManifest({
      filename: "manifest.json",

      inject: false,

      fingerprints: false,

      name: "Progressive Budget App",
      short_name: "Budget App",
      description: "An application that tracks a users budget",
      background_color: "#01579b",
      theme_color: "#317EFB",
      start_url: "/",

      icons: [
        {
          src: path.resolve("public/icons/icon-192x192.png"),
          sizes: [192, 512],
          destination: path.join("assets", "icons"),
        },
      ],
    }),
  ],
};

module.exports = config;