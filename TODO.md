# TODO

+ explicitly for and check for lack of internet connection. Currently, no output is printed, but behavior might vary on different machines / os.
+ talk about caching strategy and connectivity check in readme.
+ check for node version on bin/terminal-weather invocation with '/usr/bin/env node --version'.  If it's less than acceptible version, notify user and exit.
+ extract any code that deals with a particular api into its own api file, e.g. owmAPI.js so different APIs can be used.
+ make a list of potential contributions that would be obviously useful to terminal-weather
+ Launch an invocation to cache weather asap on initialization once you have the api key and the temp unit.
+ Launch a delayed background request based on a predicted cache-expiration to retrive the weather and make the string in the background. This could eliminate the total delay for most invocations. 

+ test
    + see ./tests/things_to_test.txt

+ bugs:
    + combining --nocache and --prompt flags do not work
    + post uninstall hook hangs the terminal. is this exit code related?
