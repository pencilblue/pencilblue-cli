# pencilblue-cli

A command line interface for PencilBlue.

## Getting Started
Install the module with: `sudo npm install -g pencilblue-cli`

## Examples
### Create and install a PencilBlue instance
```
pbctrl install <directory>
```
### Start PencilBlue
From the root directory of a PencilBlue instance:
```
pbctrl start <optional method>
```
Optional methods are nodemon, node, and forever.  When no option is provided the ```node``` option will be used
### Get pencilblue-cli version
```
pbctrl version
```
or 
```
pbctrl --version
```
or
```
pbctrl v
```

### Get pencilblue-cli help
```
pbctrl
```
or
```
pbctrl help
```
or
```
pbctrl h
```

## License
Copyright (c) 2014 PencilBlue  
Licensed under the MIT license.
