const gulp = require('gulp');
const del = require('del');
const workboxBuild = require('workbox-build');

const clean = () => del(['build/*'], { dot: true });
gulp.task('clean', clean);

const copy = () => gulp.src(['app/**/*']).pipe(gulp.dest('build'));
gulp.task('copy', copy);

const copyCloudinaryPlugin = () => gulp.src(['node_modules/cloudinary-workbox-plugin/dist/cloudinaryPlugin.js']).pipe(gulp.dest('build'));
gulp.task('copy-cloudinary-plugin', copyCloudinaryPlugin);

const serviceWorkerBuild = async () => {
  return await workboxBuild
  .generateSW({
    swDest: 'build/sw.js',
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
  });
};

gulp.task('service-worker-importscript', serviceWorkerBuild);

const build = gulp.series('clean', 'copy', 'copy-cloudinary-plugin', 'service-worker-importscript');

const watch = () => gulp.watch('app/**/*', build);

gulp.task('watch', watch);
gulp.task('default', build);