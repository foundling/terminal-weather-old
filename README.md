# terminal-weather

Terminal weather is a cli tool that outputs a minimal description of the weather. You can embed it in your terminal prompt or use it by itself.

## Requirements

+ An API key from [openweathermap.org](http://openweathermap.org)
+ NodeJS and npm

## Installation

+ run `npm install -g terminal-weather`
+ when you run terminal-weather for the first time, you will be prompted for your open weathermap.org API key as well the default temperature unit.

## Configuration 

You can also edit the json configuration file manually.

### Putting `terminal-weather` in your Bash Prompt

+ API Key
This is required in order to make requests without having your ip address blocked. 

### Units 

+ **default** for Kelvin
+ **imperial** for fahrenheit
+ **metric** celcius and fahrenheit)

If you want to put the weather in your bash prompt, there are a few things you need to do:
    
    # to prevent caching
    set_bash_prompt() {
        PS1="`terminal-weather` \u@[\h] ${FG_CYAN} \w${FG_WHITE}\n$ $(history -n)"
    }
    PROMPT_COMMAND="set_bash_prompt; $PROMPT_COMMAND"




