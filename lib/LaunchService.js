var LaunchService = function(){};

LaunchService.prototype.startPB = function(method) {
	fs.exists(process.cwd() + '/pencilblue.js', function(exists) {
		if(!exists) {
			console.log('You must be in the root directory of a PencilBlue installation to run the start command.');
			return;
		}

		if(method) {
			switch(method) {
				case 'nodemon':
		                    if (!shell.which('nodemon')) {
		                        console.log('nodemon is not installed.');
		
		                        var nodemonPromptSchema = {
		                            properties: {
		                                install: {
		                                    description: 'Will you like to install it now?',
		                                    default: 'y/N',
		                                    type: 'string'
		                                }
		                            }
		                        }
		                        
		                        prompt.start();
		
		                        prompt.get(nodemonPromptSchema, function(err, nodemonSettings) {
		                            if (err) {
		                                throw err;
		                            }
		
		                            if (nodemonSettings.install.toLowerCase() === 'y' || nodemonSettings.install.toLowerCase() === 'yes') {
		                                console.log('Installing Nodemon...');
		                                shell.exec('npm install -g nodemon');
		                                return;
		                            } else {
		                                return;
		                            }
		                        });
		                    }
		                    shell.exec('nodemon pencilblue.js');
		                    return;
				case 'node':
					if(!shell.which('node')) {
						console.log('node is not installed.');
						return;
					}
					shell.exec('node pencilblue.js');
					return;
				case 'forever':
					if (!shell.which('forever')) {
		                        console.log('forever is not installed.');
		
		                        var foreverPromptSchema = {
		                            properties: {
		                                install: {
		                                    description: 'Will you like to install it now?',
		                                    default: 'y/N',
		                                    type: 'string'
		                                }
		                            }
		                        }
		                        
		                        prompt.start();
		
		                        prompt.get(foreverPromptSchema, function(err, foreverSettings) {
		                            if (err) {
		                                throw err;
		                            }
		
		                            if (foreverSettings.install.toLowerCase() === 'y' || foreverSettings.install.toLowerCase() === 'yes') {
		                                console.log('Installing Forever...');
		                                shell.exec('npm install -g forever');
		                                return;
		                            } else {
		                                return;
		                            }
		                        });
		                    }
		                    shell.exec('forever start pencilblue.js');
				    return;
					
					
					
					
					
				default:
					console.log('method not supported.');
					return;
			}
		}

		if(shell.which('nodemon')) {
			shell.exec('nodemon pencilblue.js');
		}
		else if(shell.which('node')) {
			shell.exec('node pencilblue.js');
		}
		else {
			console.log('node is not installed.');
		}
	});
};

module.exports = LaunchService;
