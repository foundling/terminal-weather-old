const fs = require('fs');
const path = require('path');
const os = require('os');
const HOMEDIR = os.homedir();
const configPath = path.join(HOMEDIR, '.terminal-weather.json');

fs.stat(configPath, function(err, stats) {

    if (stats) {
        console.log(stats);
        console.log(`*terminal-weather install failure* configuration file already exists ( ${configPath} ) `);
    }

    console.log(`writing configuration file to ${ configPath }`);
    fs.readFile('../config-blank.json', function(err, data) {
        if (err) throw err;
        fs.writeFile(configPath, data.toString(), function(err) {
            if (err) throw err;
        }); 
    });

});
