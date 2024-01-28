// // script.js
// var map = L.map('map').setView([51.505, -0.09], 13);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
// }).addTo(map);

// // You can add more layers and functionalities here


// Initialize the map
var map = L.map('map').setView([51.505, -0.09], 13);

// Add base layers
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
});

var satelliteLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© Mapbox',
    id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'sk.eyJ1IjoiYXZpbmFzaHBrMTYiLCJhIjoiY2xyeDg5Y2NjMTc0YjJrbXJqc3pleHkzNCJ9.hcpfDSh_rpIgC0UsnJxzVQ'
});

// Add layers control
var baseLayers = {
    "OpenStreetMap": osmLayer,
    "Satellite": satelliteLayer
};

L.control.layers(baseLayers).addTo(map);

// Set default layer
osmLayer.addTo(map);

function searchLocation() {
    var query = document.getElementById('searchInput').value;
    if (query.trim() !== '') {
        // Perform geocoding request
        fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(query) + '.json?access_token=sk.eyJ1IjoiYXZpbmFzaHBrMTYiLCJhIjoiY2xyeDg5Y2NjMTc0YjJrbXJqc3pleHkzNCJ9.hcpfDSh_rpIgC0UsnJxzVQ')
            .then(response => response.json())
            .then(data => {
                if (data.features.length > 0) {
                    var coordinates = data.features[0].geometry.coordinates;
                    var latitude = coordinates[1];
                    var longitude = coordinates[0];
                    // Center map on the searched location
                    map.setView([latitude, longitude], 13);
                    // You can add a marker at the searched location if desired
                    L.marker([latitude, longitude]).addTo(map)
                        .bindPopup(data.features[0].place_name)
                        .openPopup();
                } else {
                    alert('Location not found');
                }
            })
            .catch(error => {
                console.error('Error fetching geocoding data:', error);
            });
    } else {
        alert('Please enter a location to search');
    }
}

document.getElementById('searchButton').addEventListener('click', function() {
    searchLocation();
});


// Load and add sample GeoJSON data
fetch('data/sample.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data).addTo(map);
    })
    .catch(error => {
        console.error('Error loading GeoJSON data:', error);
    });

//