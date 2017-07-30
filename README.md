# terminal-weather

Terminal weather is an embeddable cli command that outputs a minimal description of the weather. It is optimized for the prompt and cached every ten minutes by default.

## Requirements

+ An API key from [openweathermap.org](http://openweathermap.org)
+ NodeJS and npm

## Installation

+ run `npm install -g terminal-weather`
+ when you run terminal-weather for the first time, you will be prompted for your open weathermap.org API key as well the default temperature unit.

## Caching and Module loading

+ terminal-weather adheres to openweathermap.org's limit of 1 http call every ten minutes. The rest of time it outputs a cached value. 
+ Because the most frequent case is retrieving cached data, only the bare minimum is loaded to support that.  In case of a cache expiration, the full module set is loaded to retreive the new value. This results in a seamless terminal experience when embedding terminal-weather in your terminal prompt (see below). 

## Command-line options
+ These are coming soon.

## Configuration 

+ On the first run, terminal-weather prompts you for the values it needs to continually query the api.
+ Then it writes a JSON configuration file called '.terminal-weather.json' to your $HOME directory.

    {
        "API_KEY": "SECRET",
        "units": "imperial",
        "cacheInterval": 600000,
        "cache": null
    }

If you want to edit the .json file directly, temperature units should be indicated according to the following:

+ **default** for Kelvin
+ **imperial** for fahrenheit
+ **metric** celcius and fahrenheit)

### Getting `terminal-weather` into your terminal prompt

If you want to include terminal-weather in your bash prompt, there are a couple things you need to do:

1. Make sure that /usr/local/bin is in your $PATH. If you can't run 'terminal-weather' in your terminal, you may have not installed it globally. 
2. Add the following lines to your ~/.bashrc file

        # a function to insert the terminal-weather bash fn inside the PS1 variable
        set_bash_prompt() {
            PS1="`terminal-weather` \u@[\h]$ $(history -n)"
        }

        # include above fn in prompt command to set the prompt each time it is rendered
        PROMPT_COMMAND="set_bash_prompt; $PROMPT_COMMAND"

