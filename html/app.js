(function(){
    var MSG_APPROXIMATE = '<p>This is an approximate WiFi coverage area. The council does not provide this data.</p>';
    var MSG_NOWARRANTY = '<p>These WiFi locations are provided for free by <a href="http://www.brisbane.qld.gov.au/facilities-recreation/wi-fi-brisbane">Brisbane City Council</a> and aren\'t to scale. Your experience may vary.</p>';

    // Provide your access token
    L.mapbox.accessToken = 'pk.eyJ1IjoiYXNoa3lkIiwiYSI6ImNsajB0NWMifQ.A8PtczW284fnWFD6dy3xLQ';

    var eleHeader = document.getElementsByTagName('header')[0];
    var eleFooter = document.getElementsByTagName('footer')[0];
    var eleMap = document.getElementById('map');

    // Resize the map on page change.
    function resize(){
        eleMap.style.height = (window.innerHeight - eleHeader.clientHeight - eleFooter.clientHeight)+'px';
    }
    window.addEventListener('resize', resize);
    if(window.WebFontConfig){
        WebFontConfig.active = resize;
    }
    resize();



    // var map = L.mapbox.map(eleMap, 'ashkyd.nne4phnd');
    var map = L.mapbox.map(eleMap, 'mapbox.emerald', {
        // maxBounds: [
        //     [-27.749177005163993,153.74542236328125],
        //     [-27.242420623444822,152.42706298828125],
        // ],
        // minZoom:8,
        center: [-27.4669, 153.0244],
        zoom: 15
    });

    var geo = new GeolocateControl().addTo(map);

    function numberise(num){
        return parseFloat(num);
    }

    var pixelMeterSizes = {
        10: 1 / 10,
        11: 1 / 9,
        12: 1 / 8,
        13: 1 / 7,
        14: 1/ 5,
        15: 1 / 4.773,
        16: 1 / 2.387,
        17: 1 / 1.193,
        18: 1 / 0.596,
        19: 1 / 0.298
    };

    var workspaceIcon = L.icon({
        iconUrl: 'icon-bench.svg',
        shadowUrl: 'icon-bench-shadow.svg',
        iconSize:     [25, 40], // size of the icon
        shadowSize: [36, 27],
        iconAnchor:   [13, 15],
        shadowAnchor:   [5, 0],
    });

    var hotspotIcon = L.icon({
        iconUrl: 'icon-hotspot.svg',
        shadowUrl: 'icon-hotspot-shadow.svg',
        iconSize:     [25, 25], // size of the icon
        shadowSize: [37, 29],
        iconAnchor:   [13, 15],
        shadowAnchor:   [10, 15],
    });

    var wifiIcons = L.layerGroup().addTo(map);
    var wifi = L.heatLayer([],{
        max: 2,
        maxZoom: 0,
        radius: 30,
        blur: 60,
        gradient: {
            '0': 'rgba(0,0,0,0)',
            '0.25': 'blue',
            '.8': 'cyan'
        }
    }).addTo(map);

    var workspaces = L.markerClusterGroup({
        showCoverageOnHover: false,
        removeOutsideVisibleBounds: true,
        maxClusterRadius: 150,
        disableClusteringAtZoom: 16
    }).addTo(map);

    map.on('zoomend', function(){
        var size = 100 * (pixelMeterSizes[map.getZoom()] || 1/0.2);
        size = Math.min(80, size);
        wifi.setOptions({
            radius: size,
            blur: size/2
        });
    });

    map.on('moveend', function(){
        var boundingBox = map.getBounds();
        var bounds = [
            boundingBox.getSouth(),
            boundingBox.getEast(),
            boundingBox.getNorth(),
            boundingBox.getWest(),
        ].join(',');
        window.location.hash = bounds;
        try{
            localStorage.bounds = bounds;
        } catch(e){
            console.error('LocalStorage is unavailable');
        }

        if(map.getZoom() < 15){
            map.removeLayer(wifiIcons);
        } else{
            map.addLayer(wifiIcons);
        }
    });

    function get(url, cb){
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            var DONE = this.DONE || 4;
            if (this.readyState === DONE){
                cb(null, this.responseText);
            }
        };
        request.open('GET', url, true);
        request.send(null);
    }



    // Show workspaces
    get('data/workspaces.json', function(err, data){
        try{
            data = JSON.parse(data);
        } catch(e){
            console.error('Workspaces unparseable', e);
            return;
        }
        data.features.forEach(function(feature){
            L.marker(feature.geometry.coordinates.reverse(), {
                    icon: workspaceIcon
                })
                .bindPopup([
                    '<h2>'+feature.properties.type+'</h2>',
                    '<p>'+(feature.properties.desc || 'No description provided')+'</p>'
                ].join(''))
                .addTo(workspaces);
        });
    });

    // Show wifi heatmap
    get('data/wifi.json', function(err, data){
        try{
            data = JSON.parse(data);
        } catch(e){
            console.log('wifi unparseable', e);
            return;
        }
        var APs = data.features
            .map(function(feature){
                var coord = feature.geometry.coordinates.reverse();
                L.marker(coord, {
                        icon: hotspotIcon
                    })
                    .bindPopup([
                        '<h2>'+(feature.properties.name || 'WiFi Hotspot')+'</h2>',
                        (feature.properties.desc ? ('<p>'+feature.properties.desc+'</p>') : ''),
                        (feature.properties.approximate ? MSG_APPROXIMATE : MSG_NOWARRANTY),
                    ].join(''))
                    .addTo(wifiIcons);
                return coord;
            });
        wifi.setLatLngs(APs);
    });

    var bounds;
    try{
        bounds = localStorage.bounds;
    } catch(e){
    }
    if(window.location.hash.length > 1){
        bounds = window.location.hash.substr(1);
    }

    if(bounds){
        bounds = bounds.split(',').map(numberise);

        bounds = [
            bounds.slice(0,2),
            bounds.slice(2)
        ];

        map.fitBounds(bounds);
    }
})();
