const exec = require('child_process').exec;
const fs = require('fs');

module.exports = function() {

    exec('npm uninstall -g terminal-weather', function(err, stdout, stderr) {
        console.log(err);
        console.log(stdout);
        console.log(stderr);
    });
    
}
