const fs = require('fs');

function loadJSONConfig(filepath) {
    let jsonData;

    try {
        jsonData = fs.readFileSync(filepath);
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

module.exports = { 
    loadJSONConfig, 
    makeReject, 
    ftok,
    ctok
};

