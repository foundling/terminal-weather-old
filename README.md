# terminal-weather

Terminal weather is a cli that conveys succinct weather information in text or emoji form, optimized for your terminal prompt.

## Requirements

+ An [openweathermap.org](http://openweathermap.org) API key
+ NodeJS v7.0 and npm

## Installation

+ Run `npm install -g terminal-weather`
+ When you run `terminal-weather` for the first time, you will be prompted for your open weathermap.org API key as well the default temperature unit.

## Which Services It Uses

`Terminal-weather` uses the following APIs:

+ [ip-api.com](http://ip-api.com) to map your ip to a location.
+ [openweathermap.org](http://openweathermap.org) to retrieve the current weather for your location.

## Caching and Module loading

+ `terminal-weather` adheres to [openweathermap.org](http://openweathermap.org)'s limit of 1 http call per ten-minute interval. The rest of the time it prints a cached value. 
+ `terminal-weather` loads in a progressive way. Because the most frequent case is retrieving cached data, only the modules required for that are loaded.  In case of a cache expiration, the additional modules required to retreive new weather data are loaded. The point is to maintain a seamless terminal experience when embedding terminal-weather in your prompt (see below). 

## Command-line options

````bash

  Usage: terminal-weather [options] [command]


  Options:

    -p, --prompt   Print output without a newline.
    -n, --nocache  Invalidate cached weather string, make a new request for the weather.
    -h, --help     output usage information


  Commands:

    install                 Install (or re-install) terminal-weather configuration file to /Users/alexr/.terminal-weather.json.
    list                    Print the weather codes for icon and text.
    display <display-mode>  Set display mode to "icon" or "text".
    units <unit-type>       Set unit type in config to <fahrenheit | celcius | kelvin>. Shorthand is supported, e.g. "f" for fahrenheit.
    show                    Show your configuration file
    format <format-string>  Set the format string used to configure the display of the terminal-weather output.

````

## Notes

If you update your display, units or format string, the update will not be visible until the cache expires. To make the effects immediately visible, pass the `-n` flag to explicitly invalidate the cache. E.g.: 

    terminal-weather -n --display=icon
    terminal-weather -nd=icon 

## Controlling the output

To configure the order of terminal-weather's information, pass a string of characters from the list below to the `format` command. 

**T**: Temperature

**D**: Display

The default format string is `'T D '`, which renders something like '73° F clouds ', assuming that your display setting is text. The format string is space-sensitive, so you can control the spacing how you want.

Example: `$ terminal-weather format 'D T '`.

The following are forthcoming:

**H**: Humidity

**P**: Atmospheric Pressure

**R**: Range (hi/lo)

## Configuration File

+ On the first run, terminal-weather prompts you for the values it needs to continually query the api.
+ Then it writes a JSON configuration file called '.terminal-weather.json' the application's root directory (run `terminal-weather show config` to see the location of this file).

````
    {
        "API_KEY": "API_KEY_GOES_HERE",
        "NETWORK_TIMEOUT_MS": 4000,
        "CACHE_INTERVAL_MS": 600000,
        "displayMode": "icon",
        "format": "D T",
        "units": "kelvin",
        "cache": null
    }
````

### Getting `terminal-weather` into your terminal prompt

If you want to include terminal-weather in your bash prompt, there are a couple things you need to do:

1. Make sure that /usr/local/bin is in your $PATH so that your shell can locate it. If after installing terminal weather, you can't run `terminal-weather` from your terminal, you may have not installed it globally (using the `-g` flag). 
2. Add the following lines to your ~/.bashrc file:

        # a function to insert the terminal-weather bash fn inside the PS1 variable
        set_bash_prompt() {
            PS1="`terminal-weather` \u@[\h]$ $(history -n)"
        }

        # include above fn in prompt command variable so the prompt is reset each time it is rendered
        PROMPT_COMMAND="set_bash_prompt; $PROMPT_COMMAND"


### Known Issues

Terminal weather's responsiveness seems to degrade if you source your ~/.bashrc multiple times from within a shell. 

### Removing `terminal-weather` 

+ Remove terminal weather call from the bash prompt in your `~/.bashrc` file 
+ npm `uninstall -g terminal-weather`
