// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8503', // 后端 API 地址
        changeOrigin: true,
        pathRewrite: { '^/api': '' },    // 去掉 /api 前缀
      },
    },
  },
};
