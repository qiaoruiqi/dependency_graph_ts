const merge = require('webpack-merge');
const commonconfig = require('./webpack.common.js')
 const prodconfig = {
  mode: "production",
  devtool: "cheap-module-source-map"
};
module.exports = merge(commonconfig,prodconfig)