const path = require("path");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: {
    background: "./background.js",
    content: "./content.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
    ],
  },
};

module.exports = () => {
  config.mode = isProduction ? "production" : "development";
  return config;
};
