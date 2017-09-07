const fs = require('fs');
const path = require('path');
const readline = require('readline');

const configPath = path.join(__dirname, '../config.json');
const defaultConfig = require('../data/defaultConfig');
const prompts = require('../data/prompts');

function main() {
    takeUserConfigData( writeConfigTo(configPath) );
}

function takeUserConfigData(cb) { 

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const prompter = makePrompt(prompts); 

    let userConfigData = {};
    let currentPrompt = prompter.next().value;

    process.stdout.write(currentPrompt.text);

    rl.on('line', handleInput);

    function* makePrompt(prompts) {
        while (prompts.length)
            yield prompts.shift();
    }

    function repeat(prompt) {
        process.stdout.write(`invalid: ${prompt.invalidMsg}\n${prompt.text}`);
    }

    function handleInput(response) {

        const answer = response.trim() || ' ';
        const validResponse = currentPrompt.isValid(answer);

        // check received response. Store if valid, or repeat until valid.
        if (!validResponse)
            return repeat(currentPrompt);

        userConfigData[currentPrompt.configKey] = currentPrompt.process(answer);
        currentPrompt = prompter.next().value; 

        //if more prompts, print and wait for next 'line' event 
        if (currentPrompt)
            return process.stdout.write(currentPrompt.text);

        rl.close();
        cb(Object.assign(defaultConfig, userConfigData));

    }
 
}

function writeConfigTo(configPath) {
    return function(config) {
        const outputConfig = JSON.stringify(config, null, 4);
        fs.writeFile(configPath, outputConfig, 'utf8', function(err) {
            if (err) throw err;
            console.log('installation complete 😎 ');
            process.exit(0);
        }); 
    };
}

module.exports = { main };
