const config = require(global.configPath);
const fs = require('fs');
const toJSON = (o) => JSON.stringify(o, null, 2);
const setDisplay = (config, displayMode) => Object.assign({}, config, { displayMode });

function main(displayMode) {   

    const newConfig = setDisplay(config, displayMode);
    const outputConfig = toJSON(newConfig);

    fs.writeFile(global.configPath, outputConfig, err => {
        if (err) throw err;
    });

}

module.exports = {
    main,
    setDisplay
};
