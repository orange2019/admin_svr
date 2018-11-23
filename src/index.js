import './less/index.less'
import 'babel-polyfill'

import {
  componentRegister,
  createApp
} from './app'

componentRegister()

const {
  app,
  router,
  store
} = createApp()

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(() => {

  // 添加路由钩子函数，用于处理 asyncData.
  // 在初始路由 resolve 后执行，
  // 以便我们不会二次预取(double-fetch)已有的数据。
  // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
  console.log('router onReady =============')
  
  // 加上这个房子直接进去不执行
  let loadPage = (app , store , router) => {
    const matchedComponents = router.getMatchedComponents()
    // 匹配不到的路由，执行 reject 函数，并返回 404
    if (!matchedComponents.length) {
      return reject({
        code: 404
      })
    }

    // 对所有匹配的路由组件调用 `asyncData()`
    Promise.all(matchedComponents.map(Component => {
      if (Component.asyncData) {
        return Component.asyncData({
          store,
          route: router.currentRoute
        })
      }
    })).then(() => {
      // 在所有预取钩子(preFetch hook) resolve 后，
      // 我们的 store 现在已经填充入渲染应用程序所需的状态。
      // 当我们将状态附加到上下文，
      // 并且 `template` 选项用于 renderer 时，
      // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
      context.state = store.state

      resolve(app)
    }).catch(err => {

    })
  }
  loadPage(app , store , router)

  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)

    // 我们只关心非预渲染的组件
    // 所以我们对比它们，找出两个匹配列表的差异组件
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })

    console.log('activated.length =============', activated.length)
    if (!activated.length) {
      return next()
    }

    // 这里如果有加载指示器(loading indicator)，就触发
    Promise.all(activated.map(c => {
      if (c.asyncData) {
        return c.asyncData({
          store,
          route: to
        })
      }
    })).then(() => {

      // 停止加载指示器(loading indicator)

      next()
    }).catch(next)
  })
  
  app.$mount('#app')
})