const fs = require('fs');

function loadJSONConfig(filepath) {
    let jsonData;

    try 
        jsonFile = fs.readFileSync(filepath);
    catch(e)
        throw e;

    return JSON.parse(jsonData);
}

module.exports = { loadJSONConfig };
