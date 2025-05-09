module.exports = {
    chainWebpack: config => {
      config.module
        .rule('raw')
        .test(/\.html$/)
        .use('raw-loader')
        .end();
    }
  };