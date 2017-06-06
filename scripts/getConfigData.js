const readline = require('readline');
let rl;

const prompts = [
    'Api Key: ',
    'units [F, C, K]: '
];
const answers = [];

module.exports = exports = function () { 

    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    process.stdout.write(prompts.shift());

    rl.on('line', function(data) {

        answers.push(data);
        if (!prompts.length) {
            rl.close();
            return console.log(answers);
        }
        process.stdout.write(prompts.shift());

    });

}
main();
