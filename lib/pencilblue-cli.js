#! /usr/bin/env node

/*
 * pencilblue-cli
 * https://pencilblue.org
 *
 * Copyright (c) 2014 PencilBlue
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var shell = require('shelljs');
var prompt = require('prompt');
var args = process.argv;
var moduleVersion = "0.1.0";

function help() {
    var helpText = "Usage: pencilblue <command>\n\n" +
                   "where <command> is one of:\n" +
                   "    help, install, version\n\n" +
                   "pencilblue install <directory>  create and install a PencilBlue instance\n\n" +
                   "pencilblue@" + moduleVersion + " " + args[1];
    shell.echo(helpText);
}

function version() {
    shell.echo("pencilblue@" + moduleVersion + " " + args[1]);
}

function install() {
    if(!shell.which('git')) {
        console.log('In order to install PencilBlue, Git must first be installed.');
        shell.exit(1);
        return;
    }

    var directory = args[3] || 'pencilblue';

    var promptSchema = {
        properties: {
            siteName: {
                default: 'My PencilBlue Site',
                type: 'string'
            },
            siteRoot: {
                default: 'http://localhost:8080',
                type: 'string'
            },
            siteIP: {
            default: 'localhost',
                type: 'string'
            },
            mongoServer: {
                description: 'MongoDB URL',
                default: 'mongodb://127.0.0.1:27017/',
                type: 'string'
            },
        }
    };

    prompt.start();
    prompt.get(promptSchema, function(err, siteSettings) {
        if(err) {
            throw err;
        }

        console.log('Installing PencilBlue to ' + directory + '/...');
        shell.exec('git clone https://github.com/pencilblue/pencilblue.git ' + directory);
        shell.cd(directory);
        shell.exec('sudo npm install');

        console.log('Creating config.json...');

        fs.readFile(process.cwd() + '/sample.config.json', function(err, data) {
            if(err) {
                throw err;
            }

            var config = JSON.parse(data);
            delete config.CAN_BE_REMOVED;
            config.siteName = siteSettings.siteName;
            config.siteRoot = siteSettings.siteRoot;
            config.siteIP = siteSettings.siteIP;
            config.db.servers[0] = siteSettings.mongoServer;

            fs.writeFile(process.cwd() + '/config.json', JSON.stringify(config), function(err) {
                if(err) {
                    throw err;
                }

                console.log('PencilBlue successfully installed.');
                shell.exit(1);
            });
        });
    });
}

if(!args[2]) {
    help();
}
else {
    switch(args[2]) {
        case 'help':
        case '--help':
        case '-h':
            help();
            break;
        case 'version':
        case '--version':
        case '-v':
            version();
            break;
        case 'install':
            install();
            break;
        default:
            help();
            break;
    }
}
