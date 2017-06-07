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

function mergeConfigData(configData) {

    fs.readFile(path.join(__dirname,'../config-blank.json'), 'utf8', function(err, data) {

        if (err) throw err;

        const finalConfig = Object.assign(JSON.parse(data), configData);
        fs.writeFile(configPath, JSON.stringify(finalConfig, null, 4), function(err) {
            if (err) throw err;
        }); 

    });

}
