const fs = require('fs');
const toJSON = (o) => JSON.stringify(o, null, 2);
const setDisplay = (config, displayMode) => Object.assign({}, config, { displayMode });

function main({ displayMode, configPath }) {   

    const config = require(configPath);
    const newConfig = setDisplay(config, displayMode);
    const outputConfig = toJSON(newConfig);

    fs.writeFile(configPath, outputConfig, err => {
        if (err) throw err;
    });

}

module.exports = {
    main,
    setDisplay
};
