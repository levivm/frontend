var gulp = require('gulp');
var Server = require('karma').Server;
var config = require('../config');
/**
 * Run test once and exit
 * Change singleRun to true, if you dont want watch server tests
 */
gulp.task('test', function (done) {
  new Server({
    configFile: config.karma.root,
    singleRun: false
  }, done).start();
});
