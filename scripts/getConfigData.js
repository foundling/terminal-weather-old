const readline = require('readline');
const prompts = [{
    text: 'Api Key: ',
    key: 'API_KEY',
    test: input => (input.length === 32),
    invalidMsg: 'is not a valid api key',
    answer: null
},
{
    text: 'Temperature units [ (c) for Celcius, (f) for Fahrenheit, (k) for Kelvin ]: ',
    key: 'unit',
    test: input => ['f', 'fahrenheit', 'c', 'celcius', 'k', 'kelvin'].some(validInput => validInput.match(input.toLowerCase())),
    invalidMsg: 'is not a valid temperature unit',
    answer: null
}];

function* promptUser() {
    while (prompts.length)
        yield prompts.shift();
}

function getConfigData(cb) { 

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const prompter = promptUser(); 

    let currentPrompt = prompter.next().value;
    process.stdout.write(currentPrompt.text);

    rl.on('line', function(answer) {

        const data = answer || '';

        if (!currentPrompt.test(data))
            return process.stdout.write(`${answer} ${currentPrompt.invalidMsg}.`);

        currentPrompt.answer = data;
        currentPrompt = prompter.next().value; 

        if (!currentPrompt) {
            const results = prompts.reduce(function(obj, prompt, index) {
                obj[prompt.key] = prompt.answer;
                return obj;
            }, {}); 

            rl.close();
            console.log(results);
            return cb(results);
        } 
        process.stdout.write(currentPrompt.text);

    });

}

module.exports = exoprts = getConfigData;
