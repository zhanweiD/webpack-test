const path = require('path')
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const pkg = require('./package.json')
const themeConfig = require(pkg.theme)
const theme = themeConfig()

const isProduction = process.env.NODE_ENV === 'production'

const getStyleLoader = pre => {
  return [
    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
    'css-loader',
    'postcss-loader',
    pre && {
      loader: pre,
      options:
        pre === "less-loader"
          ? {
              // antd自定义主题配置
              // 主题色文档：https://ant.design/docs/react/customize-theme-cn#Ant-Design-%E7%9A%84%E6%A0%B7%E5%BC%8F%E5%8F%98%E9%87%8F
              lessOptions: {
                modifyVars: theme,
                javascriptEnabled: true,
              },
            }
          : pre === "stylus-loader" ? {
            stylusOptions: {
              import: [path.resolve(__dirname, './src/styles/common.styl')]
            }
          } : {},
    },
  ].filter(Boolean)
}

module.exports = {
  entry: './src/index.js',
  output: {
    path: isProduction ? path.resolve(__dirname, 'dist') : undefined,
    filename: isProduction ? "static/js/[name].[contenthash:10].js" : "static/js/[name].js",
    chunkFilename: isProduction ? "static/js/[name].[contenthash:10].chunk.js" : "static/js/[name].chunk.js",
    assetModuleFilename: "static/media/[hash:10][ext][query]",
    clean: true,
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/,
            use: getStyleLoader()
          },
          {
            test: /\.less$/,
            use: getStyleLoader('less-loader')
          },
          {
            test: /\.styl$/,
            use: getStyleLoader('stylus-loader'),
          },
          {
            test: /\.(png|jpe?g|svg|gif|webp)$/,
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024,
              }
            }
          },
          {
            test: /\.(woff2?|ttf)$/,
            type: 'asset/resource'
          },
          {
            test: /\.(js|jsx)$/,
            include: path.resolve(__dirname, './src'),
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              plugins: [
                // "@babel/plugin-transform-runtime",  // presets中包含了
                !isProduction && "react-refresh/babel",
              ].filter(Boolean),
            },
          }
        ]
      }
    ]
  },
  plugins: [
    new ESLintWebpackPlugin({
      extensions: [".js", ".jsx"],
      context: path.resolve(__dirname, "./src"),
      exclude: "node_modules",
      cache: true,
      cacheLocation: path.resolve(
        __dirname,
        "node_modules/.cache/.eslintcache"
      ),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html')
    }),
    isProduction && new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:10].css',
      chunkFilename: "static/css/[name].[contenthash:10].chunk.css",
    }),
    isProduction &&
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "./public"),
            to: path.resolve(__dirname, "./dist"),
            globOptions: {
              // 忽略index.html文件
              ignore: ["**/index.html"],
            },
          },
        ],
      }),
    !isProduction && new ReactRefreshWebpackPlugin()
  ].filter(Boolean),
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? "source-map" : "cheap-module-source-map",
  resolve: {
    // 起别名，便捷引入
    // alias: {
    //   '@util': path.resolve('src/common/util'),
    //   '@common': path.resolve('src/common'),
    // },
    // 自动补全文件扩展名
    extensions: [".jsx", ".js", ".json"],
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}.js`
    },
    minimize: isProduction,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ]
  },
  devServer: {
    host: "localhost",
    port: 3000,
    open: true,
    hot: true, // 开启HMR
    historyApiFallback: true, // 解决前端路由刷新404问题
    // disableHostCheck: true,
    // headers: {
    //   'Access-Control-Allow-Origin': '*',
    // },
    // proxy: [
    //   {
    //     context: ['/config', '/api'],
    //     target: 'http://192.168.90.24',
    //     changeOrigin: true,
    //   },
    // ],
  },
  performance: false,
}