  //vue-cli3.0 里面的 vue.config.js做配置
  devServer: {
      proxy: {
          '/api': { //这里最好有一个 /
              target: 'https://api.x-metash.com/'
          }
      }
  }