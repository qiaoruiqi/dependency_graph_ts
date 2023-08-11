const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const commonconfig = {
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              // CSS 文件中使用 @import 导入其他 CSS 文件时，这些导入的 CSS 文件也可以经过预处理器的处理
              // importLoaders 配置项用于控制是否要将这些导入的 CSS 文件也传递给后续的加载器。
              importLoaders: 2,
              modules: true, // 样式模块化
            },
          },
          "sass-loader",
          "postcss-loader",
        ],
      },
      {
        // 打包字体文件
        test: /\.(eot|ttf|svg)$/,
        use: {
          loader: "file-loader",
        },
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }), //打包后运行
    new CleanWebpackPlugin(["dist"]), //打包前运行
  ],
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  proxy:[{
    context:['/search'],
    target:'http://localhost:3000/search/'
}]
};
module.exports = commonconfig;
