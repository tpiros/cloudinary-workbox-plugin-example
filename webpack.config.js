const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const workboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './app/app.js',
  output:  {
    path: path.resolve(__dirname, 'build')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin([
      { from: 'app', to: '' },
      { from: 'node_modules/cloudinary-workbox-plugin/dist/cloudinaryPlugin.js', to: '' },
    ]),
    new workboxPlugin.GenerateSW({
      swDest: 'sw.js',
      importScripts: ['./cloudinaryPlugin.js'],
      runtimeCaching: [{
        urlPattern: '/api/news',
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'api-cache',
        }
      }, {
        urlPattern: new RegExp('^https:\/\/res\.cloudinary\.com\/.*\/image\/upload\/'),
        handler: 'CacheFirst',
        options: {
          cacheName: 'cloudinary-images',
          plugins: [{
            requestWillFetch: async ({ request }) => cloudinaryPlugin.requestWillFetch(request)
          }]
        }
      }]
    })
  ]
};