var q = require('q');
var fs = require('fs');
var path = require('path');
var shell = require('shelljs');
var prompt = require('prompt');
var colors = require('colors/safe');

/**
 * Installs instances of PencilBlue.
 * @constructor
 */
var InstallService = function() {};

/**
 * Installs the application with version and location settings.
 *
 * @param  {String} [version]   The version of PencilBlue to install.
 * @param  {String} [directory] The directory to install PencilBlue to.
 * @return {Promise} A promise that resolves when installation is complete.
 */
InstallService.prototype.installWithSettings = function(version, directory) {
  var deferred = q.defer();
  var self = this;

  if(!hasRequirements) {
    deferred.reject(new Error('git and npm are required to install PencilBlue.'));
    return deferred.promise;
  }

  prompt.message = "PencilBlue".cyan;
  prompt.start();
  prompt.get(self.getInstallSchema(), function(err, siteSettings) {
    if(err) {
      deferred.reject(err);
      return;
    }

    self.performInstallation(version, directory, siteSettings).then(function() {
      deferred.resolve();
    }, function(err) {
      deferred.reject(err);
    });
  });

  return deferred.promise;
};

/**
 * Confirms that the system has the requirements for installation.
 *
 * @return {Boolean} Whether the requirements are present.
 */
InstallService.prototype.hasRequirements = function() {
  if(!shell.which('git')) {
		return false;
	}
  if(!shell.which('npm')) {
		return false;
	}

  return true;
};

/**
 * Returns the prompt schema for installation.
 *
 * @return {Object} The install prompt schema.
 */
InstallService.prototype.getInstallSchema = function() {
  return {
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
      siteIp: {
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
  };
};

/**
 * Uses the version, location, and prompt settings to install PencilBlue.
 *
 * @param  {String} [version]    The version of PencilBlue to install.
 * @param  {String} [directory]  The directory to install PencilBlue to.
 * @param  {Object} siteSettings The prompt settings.
 * @return {Promise} A promise that resolves when installation is complete.
 */
InstallService.prototype.performInstallation = function(version, directory, siteSettings) {
  var deferred = q.defer();

  directory = directory || 'pencilblue';

  console.log(colors.blue('Cloning PencilBlue from github...'));
  shell.exec('git clone https://github.com/pencilblue/pencilblue.git' + ' ' + directory);

  console.log(colors.blue('Installing npm modules...'));
  shell.cd(directory);

  if(version) {
    shell.exec('git checkout tags/' + version);
  }

  shell.exec('npm install');

  if(siteSettings.bower.toLowerCase() === 'y' || siteSettings.bower.toLowerCase() === 'yes') {
    var bowerComponentInstallCmd = 'bower install';
    if(!shell.which('bower')) {
      console.log(colors.blue('Installing Bower...'));
      shell.exec('npm install bower');
      bowerComponentInstallCmd = 'node_modules/.bin/bower install';
    }
    console.log(colors.blue('Retrieving Bower components...'));
    shell.exec(bowerComponentInstallCmd);
  }

  console.log(colors.blue('Creating config.js...'));
  var sampleFile = path.join(process.cwd(), '/sample.config.js');
  var config = require(sampleFile);

  config.siteName = siteSettings.siteName;
  config.siteRoot = siteSettings.siteRoot;
  config.siteIP = siteSettings.siteIP;
  config.sitePort = siteSettings.sitePort;
  config.db.servers[0] = siteSettings.mongoServer;
  config.db.name = siteSettings.dbName;

  var replacement = 'module.exports = ' + JSON.stringify(config, null, 4) + ';\n';
  var configStr = fs.readFileSync(sampleFile).toString().replace(/module\.exports[.\s\S]*\};/, replacement);

  fs.writeFileSync(path.join(process.cwd(), '/config.js'), configStr);

  deferred.resolve();
  return deferred.promise;
};

module.exports = new InstallService();
