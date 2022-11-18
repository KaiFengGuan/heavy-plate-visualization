const path = require('path')
// const 
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  lintOnSave: false,
  devServer: {
    port: 8008,
    proxy: {
      '/pidasApi': {
        target: 'http://219.216.81.96:5001',
        changeOrigin: true
      },
      '/nodeApi': {
        // target: 'http://219.216.80.146:7305',
        target: 'http://desktop-f25dlhv:8000',
        changeOrigin: true,
        pathRewrite: {
          '^/nodeApi': '/api'
        }
      },
      '/newbaogangapi': {
        target: 'http://219.216.81.96:5502',  // 613服务器后台
        // target: 'http://219.216.81.96:5502',  // 调试后台
        changeOrigin: true,
        pathRewrite: {
          '^/newbaogangapi': '/api'
        }
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('src', resolve('@'))

    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}
