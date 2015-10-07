#!/usr/bin/env node

/*
 * write to file daily and read from it for the rest of the day
 * then set intervals of 4 hours for updates
 * To Do: make it location based using ipapi to get the current city
 */

process.env.NODE_PATH="/Users/alexr/.node/lib/node_modules";

var fs = require('fs');
var moment = require('moment');
var http = require('http');
var city = process.argv[2] || 'Seattle';
var KtoF = function(K) {
  return parseInt( ((parseFloat(K)*9)/5) - 459.67);
};
var cachePeriod = 10;



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
          low: KtoF(weatherData['main']['temp_min']),
          high: KtoF(weatherData['main']['temp_max']),
          desc: weatherData['weather'][0]['description'],
        };
        // write this to

        var terminalWidgetString = rv['desc'] +
            ' H: ' +
            rv['high'] +
            '°F / L: ' +
            rv['low']  +
            ' °F ';

        time = getTimeAsInt();
        

        fs.writeFile('/Users/alexr/.weather', [terminalWidgetString,time].join('\n'), function(err){
           if (err) return console.log(err);
        });
        console.log('api:',terminalWidgetString);
    });
  }).end();
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
      console.log('disk:',data.toString().split('\n')[0].trim());
  });
};

//if (timeToUpdate()) readWeatherFromApi();
//else readWeatherFromDisk();
var checkTime = function() {
  fs.readFile('/users/alexr/.weather', function(err, data){
      if (err) return console.log(err);
      timeElapsed = getTimeAsInt() - parseTimeData(data);
      if (timeElapsed > cachePeriod) readWeatherFromApi(); 
      else readWeatherFromDisk();
  });
};

checkTime();
