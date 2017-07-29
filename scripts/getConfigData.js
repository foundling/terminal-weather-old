const readline = require('readline');
const prompts = require(`../scripts/prompts`);

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

module.exports = exoprts = getConfigData;
