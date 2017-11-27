const fs = require('fs');

function loadJSONConfig(filepath) {
    let jsonData;

    try {
        jsonData = fs.readFileSync(filepath, 'utf8');
    }
    catch(e) {
        throw e;
    }

    return JSON.parse(jsonData);
}

function makeReject(msg) {
    return function(err) {
        throw new Error(`${msg}. ${JSON.stringify(err, null, 4)}`);
    };
}

function updateConfig(configPath, updates) {
    const config = fs.readFileSync(configPath);
    for (let key in updates) {
        config[key] = updates[key];
    }
    return config;

}

const normalize = {
    toConfig: {
        'c': 'celcius',
        'C': 'celcius',
        'Celcius': 'celcius',
        'celcius': 'celcius',
        'f': 'fahrenheit',
        'F': 'fahrenheit',
        'Fahrenheit': 'fahrenheit',
        'fahrenheit': 'fahrenheit',
        'k': 'kelvin',
        'K': 'kelvin',
        'Kelvin': 'kelvin',
        'kelvin': 'kelvin',
    },
    toLabel: {
        'kelvin': 'K',
        'celcius': 'C',
        'fahrenheit': 'F',
    }
};

const ctof = (c) => c * (9/5) + 32;
const ktof = (k) => (9/5)*(k - 273.15) + 32;
const ftoc = (f) => (f - 32) * (5/9);
const ctok = (c) => c + 273.15;
const ktoc = (k) => k - 273.15;
const ftok = (f) => (5/9)*(f - 32) + 273.15;

const tempFuncs = { ctof, ktof, ftoc, ctok, ktoc, ftok };

function convertTemp(temp) {

    /* convertTemp(N).from(unitA).to(unitB) */

    return {
        from: function(src) {
            return {
                to: function(dest) {

                    const prefix = src.toLowerCase()[0];
                    const suffix = dest.toLowerCase()[0]
                    const fn =  tempFuncs[`${ prefix }to${ suffix }`];

                    return (prefix === suffix) ? temp : fn(temp); 
                }
            };
        }
    };

}

const delayedRequire = path => (...args) => require(path).main(...args);
const logToConsole = process.stdout.write.bind(process.stdout);

module.exports = { 
    delayedRequire,
    loadJSONConfig, 
    logToConsole,
    makeReject, 
    normalize,
    convertTemp,
    ftok,
    ctok
};
