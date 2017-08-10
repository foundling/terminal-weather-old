# TODO

+ extract any code that deals with a particular api into its own api file, e.g. owmAPI.js so different APIs can be used.
+ make a list of potential contributions that would be obviously useful to terminal-weather
+ Launch an invocation on initialization once you have the api key and the temp unit.
+ Launch a delayed background request based on a predicted cache-expiration to retrive the weather and make the string in the background. This could eliminate the total delay for most invocations. 

+ test
    + icons/text are accurate
    + modulate the icons with phase of day

+ bugs:
    + combined flags don't work
