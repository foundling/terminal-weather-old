# TODO

+ extract any code that deals with a particular api into its own api file, e.g. owmAPI.js so different APIs can be used.
+ make a list of potential contributions that would be obviously useful to terminal-weather
+ implement accurate icons 
+ modulate the icons with phase of day
+ make sure that the user's ip isn't the sole factor in the weather location. let the user pass in a specific ip with -c, --city flags.
+ optimize for the prompt WITH command-line options enabled.

+ Launch an invocation on initialization once you have the api key and the temp unit.
+ Launch a delayed background request based on a predicted cache-expiration to retrive the weather and make the string in the background. This could eliminate the total delay for most invocations. 

+ use commander.js in main index file for parsing, allowing the following 
    1. --units, -u | changes the default units in config 
    2. --no-cache, -n | ignores the cache and directly queries the weather api
    3. --city, -c | specify a different city
