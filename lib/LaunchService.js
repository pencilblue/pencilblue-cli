
//dependencies
var shell   = require('shelljs');
var prompt  = require('prompt');
var util    = require('util');
var process = require('process');
var path    = require('path');
var fs      = require('fs');

/**
 *
 * @class LaunchService
 * @constructor
 */
var LaunchService = function(){};

LaunchService.prototype.startPB = function(method) {
	var exists = fs.existsSync(path.join(process.cwd(), '/pencilblue.js'));
    if(!exists) {
        console.error('You must be in the root directory of a PencilBlue installation to run the start command.');
        process.exit(1);
    }
    
    //check for default case where no method is provided
    method = method || 'node';
    
    //launch pencilblue
    LaunchService.launchByMethod(method, function(err, result) {
        if (util.isError(err)) {
            console.error(err);
            process.exit(1);
        }
        else if (result.code != 0) {
            console.error(util.format('Failed to start PencilBlue: %j', result));
            process.exit(1);
        }
        
        //all good so we can kill our selves off
        console.log('Successfully kicked off PencilBlue');
        process.exit(0);
    });
};

LaunchService.launchByMethod = function(method, cb) {
    
    //verify method is supported
    var launchFunction = LAUNCH_TYPES[method];
    if (!launchFunction) {
        return cb(new Error(util.format('Startup method [%s] is not supported.', method)), false);
    }
    
    //verify that the method is installed
    if (LaunchService.isInstalled(method)) {
        return cb(null, launchFunction());
    }
    else if (method === 'node') {
        return cb(new Error('Node is missing from your path!'));
    }
    
    //not installed so prompt user
    LaunchService.promptInstall(method, function(err, doInstall) {
        if (util.isError(err)) {
            return cb(err);
        }
        
        //perform install
        var installResult = LaunchService.installModule(method);
        if (!installResult || installResult.code != 0) {
            return cb(new Error('Failed to install module '+method));
        }
        
        //we got through the install now finally launch the service
        cb(null, launchFunction());
    });
};

LaunchService.launchViaNodemon = function() {
    return shell.exec('nodemon pencilblue.js');
};

LaunchService.launchViaNode = function() {
    return shell.exec('node pencilblue.js');
};

LaunchService.launchViaForever = function() {
    return shell.exec('forever start pencilblue.js');
};

LaunchService.isInstalled = function(method) {
    return shell.which(method) ? true : false;
};

LaunchService.promptInstall = function(method, cb) {
    var nodemonPromptSchema = {
        properties: {
            install: {
                description: util.format('%s is not installed.  Would you like to install it now?', method),
                default: 'y/N',
                type: 'string'
            }
        }
    };
    
    prompt.start();
    prompt.get(nodemonPromptSchema, function(err, nodemonSettings) {
        if (util.isError(err)) {
            return cb(err);
        }
        cb(null, nodemonSettings.install.toLowerCase() === 'y' || nodemonSettings.install.toLowerCase() === 'yes');
    });
};

LaunchService.installModule = function(method) {
    console.log('Attempting to install %s', method);
    return shell.exec('npm install -g ' + method);
};

var LAUNCH_TYPES = Object.freeze({
    nodemon: LaunchService.launchViaNodemon,
    node: LaunchService.launchViaNode,
    forever: LaunchService.launchViaForever
});

module.exports = LaunchService;
