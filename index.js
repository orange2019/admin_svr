/**
 * vue-express-ssr index
 */

const express = require('express')
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const {
  createBundleRenderer
} = require('vue-server-renderer')
const SSR = false

let app = express()

let statics = [
  ['/js', path.join(__dirname, './dist/js')],
  ['/css', path.join(__dirname, './dist/css')],
  ['/images', path.join(__dirname, './dist/images')],
  ['/favicon.ico', path.join(__dirname, './favicon.ico')]
]
statics.forEach(staticOpt => {
  // staticOpt : ['映射路径' , '源路径']]]
  app.use(staticOpt[0], express.static(staticOpt[1]))
  console.log(`set static resource [ ${staticOpt[0]} , ${staticOpt[1]}]`)
})

let nodeEnv = process.env.NODE_ENV 

if(nodeEnv !== 'production'){
  
  // 测试环境
  const config = require('./build/webpack.server')
  const compiler = webpack(config)

  const history = require('connect-history-api-fallback');
  app.use(history({
    index: '/index.html'
  }))

  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    quiet: true //向控制台显示任何内容
  }))
  app.use(webpackHotMiddleware(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
  }))

}else {
  // 正式环境部署

  if (!fs.existsSync(path.join(__dirname, './dist'))) {
    console.warn('请运行打包命令：npm run build')
    process.exit()
  }


  if(!SSR){
    // 不使用服务端渲染
    app.get('*' , (req, res) => {
      let htmlStr = fs.readFileSync(path.join(__dirname, './dist/index.html')).toString()
      res.send(htmlStr)
    })
  }else {
    let renderer = null
    let serverBundlePath = path.join(__dirname, './dist/vue-ssr-server-bundle.json')
    if (fs.existsSync(serverBundlePath)) {
      let serverBundle = require(serverBundlePath)

      let template = fs.readFileSync(path.join(__dirname, './src/index.ssr.html'), 'utf-8')
      let clientManifest = require('./dist/vue-ssr-client-manifest.json')

      renderer = createBundleRenderer(serverBundle, {
        runInNewContext: false, // 推荐
        template, // （可选）页面模板
        clientManifest // （可选）客户端构建 manifest
      })
    }

    app.get('*', (req, res) => {
      console.log('>>>>>>>>>>>>>>>>>>>>>', req.url)
      const context = {
        url: req.url
      }
      // 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。
      // 现在我们的服务器与应用程序已经解耦！
      if (!renderer) {
        return res.send('404 err')
      }

      renderer.renderToString(context, (err, html) => {
        if (err) {
          console.error('err:', err)
          return res.send('500 err')
        }
        // console.log('html:' , html)
        // 处理异常……
        return res.end(html)
      })
    })
  }

  
}

const PROT = process.env.port || 4000

app.listen(PROT, function () {
  console.log(`Vue express ssr server: app listening on port ${PROT}!\n`);
})