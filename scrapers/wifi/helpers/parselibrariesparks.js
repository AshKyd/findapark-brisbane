var request = require('request');

var URL_DATA = 'https://www.data.brisbane.qld.gov.au/data/api/action/datastore_search?resource_id=9851b9fd-8a46-4268-9ece-4e45b143e8c9';

var geodata = {
    type: 'FeatureCollection',
    features: []
};

request(URL_DATA, function(err, response){
    var parsed = JSON.parse(response.body);
    parsed.result.records.forEach(function(row){
        geodata.features.push({
            id: row._id,
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [
                    parseFloat(row.Longitude),
                    parseFloat(row.Latitude)
                ]
            },
            properties: {
                type: row.Site,
                desc: row['Wifi Hotspot Name']
            }
        });
    });
    console.log(JSON.stringify(geodata));
});
