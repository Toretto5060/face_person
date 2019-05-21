module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : './',

  // 将构建好的文件输出到哪里
  outputDir: process.env.NODE_ENV === 'production' ? 'dist_pro' : 'dist_dev',

  devServer: {
    // host: '0.0.0.0',
    port: 6060,
    open:false,
    https: true,
    before: app => { }
  },

  lintOnSave: false
}
