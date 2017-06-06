const readline = require('readline');
let rl;

const prompts = [
{
    user: 'Api Key: ',
    key: 'API_KEY',
},
{
    user: 'units [F, C, K]: ',
    key: 'units'
}
];
const answers = [];

module.exports = exports = main; 

function main (cb) { 

    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let currentPrompt = prompts.shift();
    process.stdout.write(currentPrompt.user);

    rl.on('line', function(data) {

        answers.push(data);
        if (!prompts.length) {

            let results = prompts.reduce(function(obj, prompt, index) {
                obj[prompt.key] = answers[index]; 
                return obj;
            }, {}); 

            rl.close();
            return cb(results);
        }
        process.stdout.write(prompts.shift().user);

    });

}
