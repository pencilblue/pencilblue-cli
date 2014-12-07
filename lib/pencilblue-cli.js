#! /usr/bin/env node

/*
 * pencilblue-cli
 * https://pencilblue.org
 *
 * Copyright (c) 2014 PencilBlue
 * Licensed under the MIT license.
 */

'use strict';

global.fs = require('fs');
global.shell = require('shelljs');
global.prompt = require('prompt');
global.moduleVersion = "0.2.0";

//configure environment
var process = require('process');
process.on('uncaughtException', function(err) {
    console.error(err);
    process.exit(1);
});
process.on('SIGINT', function() {
  process.exit(0);
});

var InstallService = require('./InstallService');
var instService = new InstallService();

var InfoService = require('./InfoService');
var infoService = new InfoService();

var LaunchService = require('./LaunchService');
var launchService = new LaunchService();

var args = process.argv;

if(!args[2]) {
    infoService.getHelp(args[1]);
}
else {
    switch(args[2]) {
        case 'help':
        case '--help':
        case '-h':
            infoService.getHelp(args[1]);
            break;
        case 'version':
        case '--version':
        case '-v':
            infoService.getVersion(args[1]);
            break;
        case 'install':
            instService.install(args[3] || 'pencilblue');
            break;
        case 'start':
            launchService.startPB(args[3]);
            break;
        default:
            infoService.getHelp(args[1]);
            break;
    }
}
