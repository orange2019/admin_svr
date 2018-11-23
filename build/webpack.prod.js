/**
 * webpack 生产环境
 */
process.env.NODE_ENV = 'production'

const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const config = require('./webpack.base')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

// 删除前一次编译的文件
const CleanWebpackPlugin = require('clean-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

module.exports = merge(config, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new UglifyJSPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
          drop_debugger: true,
          drop_console: true
        },
      },
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new CleanWebpackPlugin(['dist'], {
      root: path.join(__dirname, '../')
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "manifest",
    //   minChunks: Infinity
    // }),
    // 此插件在输出目录中
    // 生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin()
  ],
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm.js'
    }
  }
})