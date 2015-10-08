#!/usr/bin/env node

/*
 *
 * write to file every x hours and read from it for x hours. 
 * To Do: make it location based using ip-api.com to get the current city
 *
 */

process.env.NODE_PATH="/Users/alexr/.node/lib/node_modules";

var fs = require('fs');
var moment = require('/Users/alexr/.node/lib/node_modules/moment');
var http = require('http');
var city = process.argv[2] || null;
var KtoF = function(K) {
  // kelvin to farenheit equation
  return parseInt( ((parseFloat(K)*9)/5) - 459.67);
};
var cachePeriod = 10;



var checkTime = function() {
  fs.readFile('/users/alexr/.weather', function(err, data){
      if (err) return console.log(err);

      var start = parseTimeData(data);
      var now = getTimeAsInt();
      timeElapsed = now - start;

      if (!start) readWeatherFromApi();
      if (timeElapsed > cachePeriod) readWeatherFromApi(); 
      else readWeatherFromDisk();
  });

};

var getTimeAsInt = function() {
  return parseInt(moment().format('YYYYMMDDhhmmss'));
};

var parseTimeData = function(data) {
  return parseInt(data.toString().split('\n')[1].trim());
};

var readWeatherFromDisk = function() {
  fs.readFile('/users/alexr/.weather', function(err, data){
      if (err) return console.log(err);
      console.log('d:',data.toString().split('\n')[0].trim());
  });
};

var readWeatherFromApi = function() {
  http.request({host: 'api.openweathermap.org',
      path: '/data/2.5/weather?q=' + city + ',us'
    }, 
    function(response) {
      var buffer = '';

      response.on('data', function (chunk) {
        buffer += chunk;
      });

      response.on('end', function () {
        var time;
        var weatherData = JSON.parse(buffer);
        var rv = {
          temp: KtoF(weatherData['main']['temp_min']),
          low: KtoF(weatherData['main']['temp_min']),
          high: KtoF(weatherData['main']['temp_max']),
          desc: weatherData['weather'][0]['description'],
        };

        var terminalWidgetString = 
            rv['temp'] +
            ' °F, ' +
            rv['desc'];

        time = getTimeAsInt();
        

        fs.writeFile('/Users/alexr/.weather', [terminalWidgetString,time].join('\n'), function(err){
           if (err) return console.log(err);
        });
        console.log('a:',terminalWidgetString);
    });
  }).end();
};

checkTime();
