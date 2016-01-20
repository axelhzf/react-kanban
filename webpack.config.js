module.exports = {
  entry: "./src/js/app.js",
  output: {
    path: "./dist",
    filename: "bundle.js",
    publicPath: "/assets/"
  },
  module: {
    loaders: [
      {
        test : /\.js$/,
        loader: "babel",
        exclude: /node_modules/,
        query: {
          presets: ["es2015", "stage-0", "react"]
        }
      },
      {
        test: /\.css$/,
        loaders: ["style", "css"]
      },
      {
        test: /\.(ttf|eot|svg|woff2?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      }
    ]
  }

};