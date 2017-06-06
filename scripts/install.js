const fs = require('fs');
const path = require('path');
const os = require('os');
const HOMEDIR = os.homedir();
const configPath = path.join(HOMEDIR, '.terminal-weather.json');
const getConfigData = require('./getConfigData');

fs.stat(configPath, function(err, stats) {

    if (stats) {

        console.log(stats);
        console.log(`*terminal-weather install failure* configuration file already exists ( ${configPath} ) `);

    } else if (err && err.code === 'ENOENT') {

        getConfigData(function(configData) {

            // merge config data with config-blank.json
            //
            console.log(`writing configuration file to ${ configPath } ...`);
            fs.readFile(path.join(__dirname,'../config-blank.json'), function(err, data) {

                if (err) throw err;

                fs.writeFile(configPath, data.toString(), function(err) {
                    if (err) throw err;
                }); 

            });

        });

    }

});
