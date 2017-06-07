const readline = require('readline');

module.exports = function(cb) { 

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answers = [];
    const prompts = [
        {
            user: 'Api Key: ',
            key: 'API_KEY',
        },
        {
            user: 'temperature units [c for celcius, f for fahrenheit, k for Kelvin ]: ',
            key: 'units'
        }
    ];

    let promptIndex = 0;

    process.stdout.write(prompts[promptIndex++].user);
    rl.on('line', function(data) {
        answers.push(data.trim());

        if (promptIndex >= prompts.length) {

            let results = prompts.reduce(function(obj, prompt, index) {
                obj[prompt.key] = answers[index]; 
                console.log(obj);
                return obj;
            }, {}); 

            rl.close();
            return cb(results);
        }

        process.stdout.write(prompts[promptIndex++].user);

    });

};
