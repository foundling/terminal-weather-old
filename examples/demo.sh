#!/bin/bash

# show the help screen
terminal-weather -h

# run the configuration to start getting the weather
terminal-weather configure

# show the text and icon values available
terminal-weather show display

# print out your current configuration values
terminal-weather show config

# set the units to kelvin, the display to icon, and reverse the format.
# Invalidate the cache to show the effects immediately.
terminal-weather --units=k --display=icon --format='D T' -n

# set the values back to their default and invalidate the cache to see the effects immediately. 
terminal-weather --units=f --display=text --format='T D ' -n
