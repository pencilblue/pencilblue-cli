var InfoService = function(){};

InfoService.prototype.getHelp = function(moduleLocation) {
	var helpText = "Usage: pencilblue <command>\n\n" +
				"where <command> is one of:\n" +
				"    help, install, version\n\n" +
				"pencilblue install <directory>  create and install a PencilBlue instance\n\n" +
				"pencilblue@" + moduleVersion + " " + moduleLocation;
	shell.echo(helpText);
};

InfoService.prototype.getVersion = function(moduleLocation) {
	shell.echo("pencilblue@" + moduleVersion + " " + moduleLocation);
}

module.exports = InfoService;
