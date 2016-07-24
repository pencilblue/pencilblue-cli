var fs = require('fs');
var q = require('q');
var colors = require('colors/safe');

/**
 * Retrieves information about the CLI.
 * @constructor
 */
var InfoService = function() {};

/**
 * Retrieves the current version of the application.

 * @return {Promise} A promise that resolves to function(version).
 */
InfoService.prototype.getVersion = function() {
  var deferred = q.defer();

  fs.readFile(__dirname + '/../../package.json', function(err, data) {
    if(err) {
      deferred.reject(err);
      return;
    }

    deferred.resolve(JSON.parse(data.toString()).version);
  });

  return deferred.promise;
};

/**
 * Returns help text and optionall outputs to the console.
 *
 * @param  {Boolean} [output] Whether to output help text to the console.
 * @return {String} The help text;
 */
InfoService.prototype.getHelp = function(output) {
	var helpText = "Usage: pencilblue <command>\n\n" +
        				 "where <command> is one of:\n" +
        				 "  help, install, version\n\n" +
        				 "pencilblue install <directory> or\n" +
                 "pencilblue install <version> <directory>\n" +
                 "  create and install a PencilBlue instance\n\n";
  if(output) {
    console.log(colors.white(helpText));
  }
	return helpText;
};

module.exports = new InfoService();
