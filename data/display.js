const ansiColors = {

    reset:  "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",

    fgBlack: "\x1b[30m",
    fgLightGray: "\x1b[90m",
    fgLightRed: "\x1b[91m",
    fgRed: "\x1b[31m",
    fgGreen: "\x1b[32m",
    fgYellow:  "\x1b[33m",
    fgBlue: "\x1b[34m",
    fgLightBlue: "\x1b[94m",
    fgMagenta: "\x1b[35m",
    fgCyan: "\x1b[36m",
    fgWhite: "\x1b[37m",

    bgBlack: "\x1b[40m",
    bgLightGray: "\x1b[100m",
    bgLightRed: "\x1b[101m",
    bgLightBlue: "\x1b[104m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
    bgWhite: "\x1b[47m",
    bgLightWhite: "\x1b[107m",

};

module.exports = exports = weatherToColorMap = {
    ansiColors,
    text: {
        clear: `${ansiColors.bgLightBlue}${ansiColors.fgYellow} clear ${ansiColors.reset}`,
        clouds: `${ansiColors.bgLightGray}${ansiColors.fgWhite} clouds ${ansiColors.reset}`,
        rain: `${ansiColors.bgBlue}${ansiColors.fgBlack} rain ${ansiColors.reset}`,
        thunder: `${ansiColors.bgLightGray}${ansiColors.fgMagenta} thunder  ${ansiColors.reset}`,
        smoke: `${ansiColors.bgWhite}${ansiColors.fgLightRed} smoke ${ansiColors.reset}`,
        haze: `${ansiColors.bgLightWhite}${ansiColors.dim}${ansiColors.fgLightGray} haze ${ansiColors.reset}`,
        snow: `${ansiColors.bgLightGray} snow ${ansiColors.reset}`,
        fog: `${ansiColors.bgLightWhite}${ansiColors.dim}${ansiColors.fgLightGray} fog ${ansiColors.reset}`,
        wind: `${ansiColors.fgLightBlue}${ansiColors.bgLightGray} wind ${ansiColors.reset}`,
        tornado: `${ansiColors.underscore}${ansiColors.fgWhite} tornado! ${ansiColors.reset} ` 
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
