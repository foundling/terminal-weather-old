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

module.exports = { 
    loadJSONConfig, 
    makeReject 
};
