var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var http = require('http');
var fs = require('fs');
var path = require('path');
var unzip = require('unzip');

var feeds = [
    // Wifi in parks
    '',

    // Wifi in the CBD
    ,
];

var geodata = {
    type: 'FeatureCollection',
    features: []
};

var i = 0;

async.each(feeds, function(url, cb){
    var outDir = '/tmp/wifi-'+(i++);
    if(fs.existsSync(outDir)){
        fs.rmdirSync(outDir);
    }
    fs.mkdirSync(outDir);

    request(url)
        .pipe(unzip.Extract({ path: outDir }))
        .on('end', function(){
            console.log('unzipped');
        })

}, function(){
    console.log(JSON.stringify(geodata, null, 2));
});
