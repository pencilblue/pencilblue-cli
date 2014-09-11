var InstallService = function(){};

InstallService.prototype.install = function(directory) {
	if(!shell.which('git')) {
		console.log('In order to install PencilBlue, Git must first be installed.');
		shell.exit(1);
		return;
	}

	var promptSchema = {
		properties: {
			siteName: {
				description: 'site name',
				default: 'My PencilBlue Site',
				type: 'string'
			},
			siteRoot: {
				description: 'site root',
				default: 'http://localhost:8080',
				type: 'string'
			},
			siteIP: {
				description: 'site IP',
				default: 'localhost',
				type: 'string'
			},
			sitePort: {
				description: 'site port',
				default: 8080,
				type: 'number'
			},
			mongoServer: {
				description: 'MongoDB URL',
				default: 'mongodb://127.0.0.1:27017/',
				type: 'string'
			},
			dbName: {
				description: 'database name',
				default: 'pencilblue',
				type: 'string'
			},
			bower: {
				description: 'Do you want to install Bower components?',
				default: 'y/N',
				type: 'string'
			}
		}
	};

	prompt.message = "PencilBlue".cyan;

	prompt.start();
	prompt.get(promptSchema, function(err, siteSettings) {
		if(err) {
			throw err;
		}

		console.log('Installing PencilBlue to ' + directory + '/...');
		shell.exec('git clone https://github.com/pencilblue/pencilblue.git ' + directory);
		shell.cd(directory);

		console.log('Installing Node modules...');
		shell.exec('npm install');

		if(siteSettings.bower.toLowerCase() === 'y' || siteSettings.bower.toLowerCase() === 'yes') {
			if(shell.which('bower')) {
				console.log('Retrieving Bower components...');
				shell.exec('bower install');
			}
			else {
				console.log('Installing Bower...');
				shell.exec('npm install bower');

				console.log('Retrieving Bower components...');
				shell.exec('node_modules/.bin/bower install');
			}
		}

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
			config.sitePort = siteSettings.sitePort;
			config.db.servers[0] = siteSettings.mongoServer;
			config.db.name = siteSettings.dbName;

			fs.writeFile(process.cwd() + '/config.json', JSON.stringify(config, null, "    "), function(err) {
				if(err) {
					throw err;
				}

				console.log('PencilBlue successfully installed.');
				shell.exit(1);
			});
		});
	});
};

module.exports = InstallService;
