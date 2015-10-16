var fs = require('fs');
var path = require('path');

var geojson;

var dir = path.join(__dirname, '../dist/')
var contents = fs.readdirSync(dir);

var isGeoJson = function(file){
    return file.indexOf('geojson') !== -1;
}

contents.filter(isGeoJson).forEach(function(filename){
    var contents = fs.readFileSync(path.join(dir, filename), 'utf8');
    try{
        var file = JSON.parse(contents);
        if(!geojson){
            geojson = file;
        } else {
            geojson.features = geojson.features.concat(file.features);
        }
    } catch(e){
        console.log(contents);
        throw e;
    }
});

console.log(JSON.stringify(geojson));
