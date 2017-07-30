# TODO

+ extract any code that deals with a particular api into it's own api file, e.g. owmAPI.js so different api's can be used.
+ use commander.js in main index file for parsing, allowing the following 
    1. --units, -u | changes the default units in config 
    2. --no-cache, -n | ignores the cache and directly queries the weather api
    3. --city, -c | specify a different city
