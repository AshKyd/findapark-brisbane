var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');

var kml = fs.readFileSync(path.join(process.cwd(), process.argv[2]));
var $ = cheerio.load(kml, {
    normalizeWhitespace: true,
    xmlMode: true
});


var numberise = function(num){
    return Number(num);
};

var geodata = {
    type: 'FeatureCollection',
    features: []
};

$('Placemark').each(function(){
    geodata.features.push({
        // id: -1,
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: $('coordinates', this).text().split(',').map(numberise).slice(0, 2)
        },
        properties: {
            name: $('name', this).text(),
            desc: $('description', this).text().replace(/\s+\(.+\)$/, '')
        }
    });
});

console.log(JSON.stringify(geodata, null, 2));
