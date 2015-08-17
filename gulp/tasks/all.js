/**
 * General Section - General modules, values and tasks
 */

var gulp  = require('gulp');

/** Meta Task to inject dependencies **/
gulp.task('injector', ['css-injector', 'js-injector', 'serverConf-injector']);

/** Default Task, run serve when gulp is called without arguments **/
gulp.task('default', ['serve']);
