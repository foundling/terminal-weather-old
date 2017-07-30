# terminal-weather

Terminal weather is a cli tool that outputs a minimal description of the weather. You can embed it in your terminal prompt or use it by itself. It is optimized to be embedded in your terminal prompt, so you won't get bogged down by recurrent loading of modules and http calls to the weather api every time your prompt is re-rendered.

## Requirements

+ An API key from [openweathermap.org](http://openweathermap.org)
+ NodeJS and npm

## Installation

+ run `npm install -g terminal-weather`
+ when you run terminal-weather for the first time, you will be prompted for your open weathermap.org API key as well the default temperature unit.

## Caching and Module loading

+ terminal-weather follows the advice of openweathermap.org to make a maximum of 1 http call per 10 minute interval. The rest of time it is outputting a cached value. 
+ Because the most frequent case is retrieving cached data, only the bare minimum is loaded to support that.  In case of a cache expiration, the full module set is loaded to retreive the new value. This results in a seamless terminal experience when embedding terminal-weather in your terminal prompt (see below). 

## Command-line options
+ These are coming soon.

## Configuration 

+ terminal-weather writes a JSON configuration file called '.terminal-weather.json' to your home directory.

### Units 

+ **default** for Kelvin
+ **imperial** for fahrenheit
+ **metric** celcius and fahrenheit)

### Putting `terminal-weather` in your Bash Prompt

If you want to put the weather in your bash prompt, there are a few things you need to do:
    
    # to prevent caching
    set_bash_prompt() {
        PS1="`terminal-weather` \u@[\h] ${FG_CYAN} \w${FG_WHITE}\n$ $(history -n)"
    }
    PROMPT_COMMAND="set_bash_prompt; $PROMPT_COMMAND"




