# terminal-weather

Terminal weather is a cli that conveys succinct weather information in text or emoji form, optimized for your terminal prompt.

## Requirements

+ An [openweathermap.org](http://openweathermap.org) API key
+ NodeJS v7.0 and npm

## Installation

+ Run `npm install -g terminal-weather`
+ When you run `terminal-weather` for the first time, you will be prompted for your open weathermap.org API key as well the default temperature unit.

## Caching and Module loading

+ `terminal-weather` adheres to [openweathermap.org](http://openweathermap.org)'s limit of 1 http call per ten-minute interval. The rest of the time it prints a cached value. 
+ `terminal-weather` loads in a progressive way. Because the most frequent case is retrieving cached data, only the modules required for that are loaded.  In case of a cache expiration, the additional modules required to retreive new weather data are loaded. The point is to maintain a seamless terminal experience when embedding terminal-weather in your prompt (see below). 

## Which Services It Uses

`Terminal-weather` uses the following APIs:

+ [ip-api.com](http://ip-api.com) to map your ip to a location.
+ [openweathermap.org](http://openweathermap.org) to retrieve the current weather for your location.

## Command-line options

````bash
  Usage: terminal-weather [options] [command]


  Options:

    -p, --prompt   Print output without a newline.
    -n, --nocache  Invalidate cached weather string, make a new request for the weather.
    -h, --help     Output usage information.

  Commands:

    install|i                 Install (or re-install) terminal-weather configuration file to your configuration file.
    list|l                    Print the weather codes for icon and text.
    display|d <display-mode>  Set display mode to "icon" or "text".
    units|u <unit-type>       Set unit type in config to <fahrenheit | celcius | kelvin>. Shorthand is supported, e.g. "f" for fahrenheit.
    show|s                    Show the contents of your configuration file in a more readable format.

````

## Configuration 

+ On the first run, terminal-weather prompts you for the values it needs to continually query the api.
+ Then it writes a JSON configuration file called '.terminal-weather.json' to your $HOME directory.

````
    {
        "API_KEY": "API_KEY_GOES_HERE",
        "TIMEOUT_MS": 4000,
        "CACHE_INTERVAL_MS": 600000,
        "displayMode": "icon",
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

