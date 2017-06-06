const fs = require('fs');
const path = require('path');
const os = require('os');
const HOMEDIR = os.homedir();
const configPath = path.join(HOMEDIR, '.terminal-weather.json');
const getConfigData = require('./getConfigData');

module.exports = exports = main;

function main() {
    fs.stat(configPath, writeConfigOrErr);
}

function mergeConfigData(configData) {

    console.log(`writing configuration file to ${ configPath } ...`);
    fs.readFile(path.join(__dirname,'../config-blank.json'), function(err, data) {

        if (err) throw err;

        let finalConfig = Object.assign(data.toString(), configData);
        console.log('FINAL CONFIG');
        console.log(finalConfig);
        fs.writeFile(configPath, finalConfig, function(err) {
            if (err) throw err;
        }); 

    });

}

function writeConfigOrErr(err, stats) {

    // file exists: warn user and exit
    if (stats) {

        console.log(`*terminal-weather install failure* configuration file already exists ( ${configPath} ) `);
        process.exit(1);

    } 

    // file doesn't exist: write config
    else if (err && err.code === 'ENOENT') {

        getConfigData(mergeConfigData);

    }

}

main();
