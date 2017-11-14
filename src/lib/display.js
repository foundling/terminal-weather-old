const path = require('path');
const {

    reset,
    bright,
    dim,
    underscore,
    blink,
    reverse,
    hidden,
    fgBlack,
    fgLightGray,
    fgLightRed,
    fgRed,
    fgGreen:
    fgYellow,
    fgBlue,
    fgLightBlue,
    fgMagenta,
    fgCyan,
    fgWhite,

    bgBlack,
    bgLightGray,
    bgLightRed,
    bgLightBlue,
    bgRed,
    bgGreen,
    bgYellow,
    bgBlue,
    bgMagenta,
    bgCyan,
    bgWhite,
    bgLightWhite

} = require(path.join(__dirname,'colors'));

module.exports = exports = {
    text: {
        clear: `${bgLightBlue}${fgYellow} clear ${reset}`,
        clouds: `${bgLightGray}${fgWhite} clouds ${reset}`,
        rain: `${bgBlue}${fgBlack} rain ${reset}`,
        thunder: `${bgLightGray}${fgMagenta} thunder  ${reset}`,
        smoke: `${bgWhite}${fgLightRed} smoke ${reset}`,
        mist: `${bgWhite}${fgLightBlue} mist ${reset}`,
        haze: `${bgLightWhite}${dim}${fgLightGray} haze ${reset}`,
        snow: `${bgLightGray} snow ${reset}`,
        fog: `${bgLightWhite}${dim}${fgLightGray} fog ${reset}`,
        wind: `${fgLightBlue}${bgLightGray} wind ${reset}`,
        tornado: `${underscore}${fgWhite} tornado! ${reset} ` 
    },
    icon: {
        clear: {
            day:  '☀️',
            night: '✨'
        },
        clouds: {
            day: '⛅',
            night: '☁️',
        },
        rain: {
            day: '🌧',
            night: '🌧',
        },
        thunder: {
            day: '⚡️',
            night: '⚡️'
        },
        smoke: {
            day: '🌫',
            night: '🌫'
        },
        haze: {
            day: '🌫',
            night: '🌫'
        },
        mist: {
            day: '🌫',
            night: '🌫'
        },
        snow: {
            day: '☃️',
            night: '☃️',
        },
        fog: {
            day: '🌁',
            night: '🌁',
        },
        wind: {
            day: '💨',
            night: '💨',
        },
        tornado: {
            day: '🌪',
            night: '🌪',
        }
    },

};
