const exec = require('child_process').exec;
const fs = require('fs');

function main() {

    exec('npm uninstall -g terminal-weather', function(err, stdout, stderr) {
        if(err) {
            console.log(stderr);
            throw err;
        } else {
            console.log(stdout);
        }
    });
    
}

module.exports = { main };
