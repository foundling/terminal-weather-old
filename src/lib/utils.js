function loadJSONConfig(filepath) {
    let jsonData;

    try {
        jsonData = require('fs').readFileSync(filepath);
    }
    catch(e) {
        throw e;
    }

    return JSON.parse(jsonData);
}

function makeReject(msg) {
    return function(err) {
        console.log(msg);
        throw err;
    };
};

const ftok = (f) => (f + 459.67)*(5/9);
const ctok = (c) => c + 273.15;
const delayedRequire = path => (...args) => require(path).main(...args);
const logToConsole = process.stdout.write.bind(process.stdout);

module.exports = { 
    delayedRequire,
    loadJSONConfig, 
    logToConsole,
    makeReject, 
    ftok,
    ctok
};

