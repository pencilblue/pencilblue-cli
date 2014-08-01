var InfoService = function(){};

InfoService.prototype.getHelp = function(moduleLocation) {
	var helpText = "Usage: pencilblue <command>\n\n" +
				"where <command> is one of:\n" +
				"    help, install, version\n\n" +
				"pencilblue install <directory>  create and install a PencilBlue instance\n" +
				"pencilblue start <optional method> run a PencilBlue instance\n" +
				"    where <optional method> can be one of:\n" +
				"        nodemon, node, forever\n\n" +
				"pencilblue@" + moduleVersion + " " + moduleLocation;
	shell.echo(helpText);
};

InfoService.prototype.getVersion = function(moduleLocation) {
	shell.echo("pencilblue@" + moduleVersion + " " + moduleLocation);
}

module.exports = InfoService;
