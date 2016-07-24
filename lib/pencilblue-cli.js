#! /usr/bin/env node

var colors = require('colors/safe');
var process = require('process');

var info = require('./services/info');
var install = require('./services/install');

process.on('uncaughtException', function(err) {
  console.log(colors.red('Error: ' + err));
  process.exit(1);
});
process.on('SIGINT', function() {
  process.exit(0);
});

var argv = process.argv;

if(typeof argv[2] === 'undefined') {
  info.getHelp(true);
}
else {
  switch(argv[2]) {
    case 'version':
    case '--version':
    case '-v':
      info.getVersion().then(function(version) {
        console.log(colors.white(version));
      }, function(err) {
        console.log(colors.red(err));
      });
      break;
    case 'install':
      var version = null;
      var directory = 'pencilblue';
      if(typeof argv[4] !== 'undefined') {
        version = argv[3];
        directory = argv[4];
      }
      else if(typeof argv[3] !== 'undefined'){
        directory = argv[3];
      }
      install.installWithSettings(version, directory).then(function() {
        console.log(colors.green('Installation completed.'));
      }, function(err) {
        throw(err);
      });
      break;
    case 'start':
      console.log(colors.yellow('The start command is deprecated. Use `npm start` instead.'));
      break;
    case 'help':
    case '--help':
    case '-h':
      info.getHelp(true);
      break;
    default:
      info.getHelp(true);
      break;
  }
}
