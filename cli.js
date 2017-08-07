const cli = require('commander');

cli
    .option('-p,--prompt',"prompt")
    .action(terminalWeather);

cli
    .command
