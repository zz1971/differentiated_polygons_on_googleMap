"use strict";

function initMap(cnt) {
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 3.6,
        center: cnt,
        mapTypeId: "terrain",
    });
    return map;
}

function drawPolygon(path, map, k) {
    var satOrLight = (k % 100);
    var h = 360 - k;
    var pol = new google.maps.Polygon({
        paths: path,
        strokeColor: 'hsl(' + h + ',70%,40%)',
        strokeOpacity: 1,
        strokeWeight: 1.4,
        fillColor: 'hsl(' + k + ',80%,' + satOrLight + '%)',
        fillOpacity: 1,
    });
    pol.setMap(map);
    console.log(k, "100%", satOrLight);
    return pol;
}

////////////////////////Next Step: Attach Info Window////////////////////////////
function attachPolygonInfoWindow(array, html, map) {
    array.infoWindow = new google.maps.InfoWindow({
        content: html,
    });
    google.maps.event.addListener(array, 'mouseover', function (e) {
        var latLng = e.latLng;
        array.infoWindow.setPosition(latLng);
        array.infoWindow.open(map);
    });
    google.maps.event.addListener(array, 'mouseout', function () {
        array.infoWindow.close();
    });
}

function initialMap() {

    var map = initMap({
        lng: 64.16660261191,
        lat: 41.9618914644567,
    });

    var arr = [];
    while (arr.length < geojson.features.length) {
        var r = Math.floor(Math.random() * 360) + 1;
        if (arr.indexOf(r) === -1) arr.push(r);
    }
    //console.log(arr);

    for (var j = 0; j < geojson.features.length; j++) {
        var array = [];
        for (var i = 0; i < geojson.features[j].geometry.coordinates[0].length; i++) {
            array[i] = {
                lng: geojson.features[j].geometry.coordinates[0][i][0],
                lat: geojson.features[j].geometry.coordinates[0][i][1],
            }
        }
        map.setCenter(new google.maps.LatLng(array[0].lat, array[0].lng));
        var hueNumber = arr[j];
        var polStore = drawPolygon(array, map, hueNumber);
        var infoHtml = "<div class='info'><div>Address :" + geojson.features[j].properties.ADDRESS + "</div><div>Building Name :" + geojson.features[j].properties.NAME + "</div><div>" + geojson.features[j].properties.SIZE + "</div><div>" + geojson.features[j].properties.HEIGHT + "</div><div>" + geojson.features[j].properties.WIDTH + "</div><div>" + geojson.features[j].properties.NUMBER + "</div><div>" + geojson.features[j].properties.BASE + "</div><div>" + geojson.features[j].properties.STATE + "</div></div>"
        attachPolygonInfoWindow(polStore, infoHtml, map);
    }
}
