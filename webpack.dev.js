const webpack = require("webpack");
const merge = require('webpack-merge');
const commonconfig = require('./webpack.common.js')
 const devconfig = {
  mode: "development",
  devtool: "cheap-module-eval-source-map",

  devServer: {
    contentBase: "./dist",
    open: true, // 代码修改后，自动打开浏览器，自动访问地址
    port: 8080,
    hot: true,
    hotOnly: true, // 当hmr失效时，那么就让他失效，不要做额外的处理
  },

  plugins: [new webpack.HotModuleRepalcementPlugin()],
  optimization: {
    usedExports: true,
  },
};
module.exports = merge(commonconfig,devconfig)