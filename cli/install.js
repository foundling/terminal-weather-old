const fs = require('fs');
const readline = require('readline');
const prompts = require('../data/prompts');
const defaultConfig = require('../data/config');

// put config path back
function main() {
    takeUserConfigData( configWriter(global.configPath) );
}

function takeUserConfigData(cb) { 

    function* makePrompt(prompts) {
        while (prompts.length)
            yield prompts.shift();
    }

    function repeat(prompt) {
        process.stdout.write(`invalid: ${prompt.invalidMsg}\n${prompt.text}`);
    }

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const prompter = makePrompt(prompts); 

    let userConfigData = {};
    let currentPrompt = prompter.next().value;

    process.stdout.write(currentPrompt.text);

    rl.on('line', function(response) {

        const answer = response.trim() || ' ';
        let config;

        // check response validity and store value if valid, or repeat question until valid
        if (currentPrompt.isValid(answer))
            userConfigData[currentPrompt.configKey] = currentPrompt.process(answer);
        else
            return repeat(currentPrompt);

        // check for end of prompts  
        currentPrompt = prompter.next().value; 
        if (currentPrompt) {
            process.stdout.write(currentPrompt.text);
        } else {
            rl.close();
            cb(Object.assign(defaultConfig, userConfigData));
        }
    });
}

function configWriter(path) {

    return function(config) {

        fs.writeFile(path, JSON.stringify(config, null, 4), 'utf8', function(err) {
            if (err) throw err;
            console.log('installation complete 😎 ');
            process.exit(0);
        }); 

    };

}

module.exports = exports = {
    main
};
