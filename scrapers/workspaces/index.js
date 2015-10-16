var request = require('request');
var Baby = require('babyparse');

var URL_DATA = 'https://www.data.brisbane.qld.gov.au/data/dataset/39cb83b5-111e-47fb-ae21-6b141cd16f25/resource/66b3c6ce-4731-4b19-bddd-8736e3111f7e/download/Open-Data---AM---datasetparkfacilties.csv';

var geodata = {
    type: 'FeatureCollection',
    features: []
};

request(URL_DATA, function(err, response){
    var parsed = Baby.parse(response.body, {header:true});
    parsed.data.forEach(function(row){
        if(row.ITEM_TYPE && row.ITEM_TYPE.indexOf('TABLE') !== -1 && row.ITEM_TYPE.indexOf('FISH') === -1){
            geodata.features.push({
                id: row._ID,
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [
                        Number(row.LONGITUDE),
                        Number(row.LATITUDE)
                    ]
                },
                properties: {
                    type: row.ITEM_TYPE,
                    desc: row.DESCRIPTION
                }
            });
        }
    });
    console.log(JSON.stringify(geodata));
});
