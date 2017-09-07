const exec = require('child_process').exec;
const fs = require('fs');

function main() {

    exec('npm uninstall -g terminal-weather', function(err, stdout, stderr) {
        console.log(err);
        console.log(stdout);
        console.log(stderr);
    });
    
}

module.exports = { main };
