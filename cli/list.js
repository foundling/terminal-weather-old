const path = require('path');
const { text, icon } = require(path.join(__dirname,'../data/display'));

function main() {

    Object.keys(text).forEach(key => {
        console.log(`${ key }\t| ${text[key]}`);
    });

    Object.keys(icon).forEach(key => {
        console.log(`${ key } (am)\t| ${ icon[key].day }`);
        console.log(`${ key } (pm)\t| ${ icon[key].night }`);
    });

};

module.exports = { main };
