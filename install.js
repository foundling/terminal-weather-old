const readline = require('readline');
const fs = require('fs');
const path = require('path');
const os = require('os');
const HOMEDIR = os.homedir();
const configPath = path.join(HOMEDIR, '.terminal-weather.json');
const prompts = require('./prompts');

function* makePrompt(prompts) {
    while (prompts.length)
        yield prompts.shift();
}

function repeat(prompt) {
    process.stdout.write(`invalid: ${prompt.invalidMsg}\n${prompt.text}`);
}

function getConfigData(cb) { 

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const prompter = makePrompt(prompts); 

    let answers = [];
    let currentPrompt = prompter.next().value;

    process.stdout.write(currentPrompt.text);

    rl.on('line', function(response) {

        const answer = response.trim() || ' ';

        // check response validity
        if (currentPrompt.isValid(answer)) {
            answers.push(answer);
            currentPrompt = prompter.next().value; 
        } else {
            return repeat(currentPrompt);
        }

        // check for end of prompts  
        if (currentPrompt) {
            process.stdout.write(currentPrompt.text);
        } else {
            const results = prompts.reduce(function(obj, prompt, index) {
                obj[prompt.key] = answers[index];
                return obj;
            }, {}); 
            rl.close();
            cb(results);
        }
    });
}

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
