const path = require('path');
const miniCss = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');



const css = {
  test: /\.css$/,
  use: [miniCss.loader, 'css-loader', ],
};

const pug = {
  test: /\.pug$/,

  use: ['pug-loader'],
};
const svg = {
  test: /\.svg$/,
  loader: 'svg-inline-loader',
};


const pages = ['index'];

module.exports = {
  mode: 'development',
  entry: {
    ...pages.reduce((config, page) => {
      config[page] = path.resolve(__dirname, `src/${page}.js`);
      return config;
    }, {}),
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@svgs': path.resolve(__dirname, 'src/svgs'),
    },
  },
  output: {
    filename: 'scripts/[name].js',
    chunkFilename: 'chunks/[name].bundle.js',
    path: path.resolve(__dirname, 'dist/'),
  },
  

  module: {
    rules: [css,svg,pug],
  },
  plugins: []
    .concat(
      pages.map(
        (page) =>
          new HtmlWebpackPlugin({
            template: path.resolve(__dirname, `src/pages/${page}.pug`),
            filename: page === 'index' ? `${page}.html` : `pages/${page}.html`,
            chunks: [page],
          })
      )
    )
    .concat(
      pages.map(
        (page) =>
          new miniCss({
            ignoreOrder: true,
            filename: `styles/[name].css`,
          })
      )
    )

};
