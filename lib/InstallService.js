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

	prompt.message = "PencilBlue".cyan;

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
