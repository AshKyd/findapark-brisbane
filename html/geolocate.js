var svg = '<svg  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://www.w3.org/2000/svg" height="4.5184mm" width="4.5156mm" version="1.1" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" viewBox="0 0 15.999999 16.01015"><path d="m7.9631 8.0051h0.073706" class="crosshairs-inner" stroke-linecap="round" stroke-width="6" fill="none"/><g fill="none" class="crosshairs-outer" transform="translate(-652 -378.35)"><path stroke-linejoin="round" stroke-linecap="round" d="m666 386.36a6 6 0 0 1 -6 6 6 6 0 0 1 -6 -6 6 6 0 0 1 6 -6 6 6 0 0 1 6 6z"/><g stroke-width="1.5"><path d="m660 380.36v-2.0102"/><path d="m666 386.36h2"/><path d="m660 392.36v2"/><path d="m654 386.36h-2"/></g></g></svg>';

var radiusStyle = {
    fillColor: '#4EC9FF',
    fillOpacity: 0.3,
    stroke: false
};
var preciseStyle = {
    fillColor: '#4EC9FF',
    fillOpacity: 1,
    color: '#fff',
    opacity:1,
    weight:1,
    radius: 5
};
var GeolocateControl = L.Control.extend({

    options: {
        position: 'topleft'
            //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
    },

    onAdd: function(map) {
        function setClass(className){
            container.setAttribute('class', containerClass + ' ' + className);
        }
        var containerClass = 'leaflet-bar leaflet-control leaflet-control-custom leaflet-control-geolocate';
        var container = L.DomUtil.create('div', containerClass);

        container.innerHTML = '<a href="#">'+svg+'</a>';

        var aEl = container.querySelector('a');

        var jumped, precise, radius, watchID;
        aEl.onclick = function(e) {
            e.preventDefault();
            setClass('searching');
            jumped = false;

            var opts = {enableHighAccuracy: true};

            var success = function(position) {
                setClass('fixed');
                var coords = [position.coords.latitude, position.coords.longitude];
                if(!jumped){
                    map.panTo(coords);
                    jumped = 1;
                }
                if(!radius){
                    radius = L.circle(coords, position.coords.accuracy, radiusStyle).addTo(map);
                    precise = L.circleMarker(coords, preciseStyle).addTo(map);
                } else {
                    radius.setRadius(position.coords.accuracy);
                    radius.setLatLng(coords);
                    precise.setLatLng(coords);
                }
            };

            var error = function(){
                setClass('error');
            };

            if(watchID){
                navigator.geolocation.clearWatch(watchID);
            }
            watchID = navigator.geolocation.watchPosition(success, error, opts);
        };
        return container;
    }

});
