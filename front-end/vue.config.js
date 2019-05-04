const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  lintOnSave: true,
  baseUrl: '/',
  outputDir: '../src/main/resources/public',
  assetsDir: 'assets',
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined,
  css: undefined,
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        core: resolve('src/core'),
        components: resolve('src/components'),
        modules: resolve('src/components/modules'),
        router: resolve('src/router'),
        store: resolve('src/store'),
        locale: resolve('src/locale'),
        utilities: resolve('src/utilities'),
        assets: resolve('src/assets'),
        images: resolve('src/assets/images')
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Auto Alocation System',
        filename: 'public/index.html',
        favicon: 'public/favicon.ico'
      })
    ]
  }
};
