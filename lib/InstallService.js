
//dependencies
var process = require('process');
var path    = require('path');
var util    = require('util');
var fs      = require('fs');

var InstallService = function(){};

InstallService.promptSchema = Object.freeze({
    properties: {
        siteName: {
            description: 'Site Name',
            default: 'My PencilBlue Site',
            type: 'string'
        },
        siteRoot: {
            description: 'Site Root',
            default: 'http://localhost:8080',
            type: 'string'
        },
        siteIP: {
            description: 'Address to bind to',
            default: '0.0.0.0',
            type: 'string'
        },
        sitePort: {
            description: 'Site Port',
            default: 8080,
            type: 'number'
        },
        mongoServer: {
            description: 'MongoDB URL',
            default: 'mongodb://127.0.0.1:27017/',
            type: 'string'
        },
        dbName: {
            description: 'Database Name',
            default: 'pencilblue',
            type: 'string'
        },
        bower: {
            description: 'Do you want to install Bower components?',
            default: 'y/N',
            type: 'string'
        }
    }
});

InstallService.prototype.install = function(directory) {
	if(!shell.which('git')) {
		console.log('In order to install PencilBlue, Git must first be installed.');
		shell.exit(1);
		return;
	}

    //prompt with options
	prompt.message = "PencilBlue".cyan;
	prompt.start();
	prompt.get(InstallService.promptSchema, function(err, siteSettings) {
		if(err) {
			throw err;
		}

        //clone the repo
        var installDir = path.join(process.cwd(), directory);
		console.log('Installing PencilBlue to %s/...', installDir);
		shell.exec('git clone https://github.com/pencilblue/pencilblue.git ' + directory);
		
        //change down into installation directory to perform dependency install
		console.log('Installing Node modules...');
        shell.cd(directory);
		shell.exec('npm install');

        //verify bower settings
		if(siteSettings.bower.toLowerCase() === 'y' || siteSettings.bower.toLowerCase() === 'yes') {
            
            var bowerComponentInstallCmd = 'bower install';
			if(!shell.which('bower')) {
				console.log('Installing Bower...');
				shell.exec('npm install bower');
                
                //set the local bower command
                bowerComponentInstallCmd = 'node_modules/.bin/bower install';
			}
            
            //install bower components 
            console.log('Retrieving Bower components...');
            shell.exec(bowerComponentInstallCmd);
		}

        //create configuration.  Step 1 is to read in the export from the sample configuration file
		console.log('Creating config.js...');
        var sampleFile = path.join(process.cwd(), '/sample.config.js')
        var config = require(sampleFile);
        
        //step 2 is to replace the properties
        config.siteName = siteSettings.siteName;
        config.siteRoot = siteSettings.siteRoot;
        config.siteIP = siteSettings.siteIP;
        config.sitePort = siteSettings.sitePort;
        config.db.servers[0] = siteSettings.mongoServer;
        config.db.name = siteSettings.dbName;
        
        //step 3 is magic.  We use a regex pattern to find the object exported 
        //by the "module.exports" statement.  We replace the match with the 
        //serialized config object we set properties on in step 2.
        var replacement = 'module.exports = ' + JSON.stringify(config, null, 4) + ';\n';
        var configStr = fs.readFileSync(sampleFile).toString().replace(/module\.exports[.\s\S]*\};/, replacement);

        //step 4 we write the configuration to disk
		fs.writeFileSync(path.join(process.cwd(), '/config.js'), configStr);
	});
};

//exports
module.exports = InstallService;
