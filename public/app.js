const socket = io(); // Initialize the socket.io connection

// Initialize Leaflet map
const map = L.map("map").setView([0, 0], 2);

// Set up the tile layer for the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data © OpenStreetMap contributors"
}).addTo(map);

let markers = {}; // To store markers for each event type
let currentMarkers = []; // To keep track of currently displayed markers

// Dummy data for events and their locations
const eventData = {
    forestFire: [
        { lat: 38.8951, lon: -77.0364, color: 'red', label: 'Forest Fire - Washington, D.C.' },
        { lat: 34.0522, lon: -118.2437, color: 'red', label: 'Forest Fire - Los Angeles, CA' },
        { lat: 40.7128, lon: -74.0060, color: 'red', label: 'Forest Fire - New York, NY' },
        { lat: 37.7749, lon: -122.4194, color: 'red', label: 'Forest Fire - San Francisco, CA' },
        { lat: 35.6895, lon: 139.6917, color: 'red', label: 'Forest Fire - Tokyo, Japan' }
    ],
    glacierMelt: [
        { lat: 61.2181, lon: -149.9003, color: 'blue', label: 'Glacier Melt - Anchorage, Alaska' },
        { lat: 60.4720, lon: 8.4689, color: 'blue', label: 'Glacier Melt - Norway' },
        { lat: 64.9631, lon: -19.0208, color: 'blue', label: 'Glacier Melt - Iceland' },
        { lat: 66.1605, lon: -153.3691, color: 'blue', label: 'Glacier Melt - Alaska, USA' },
        { lat: 69.6492, lon: 18.9553, color: 'blue', label: 'Glacier Melt - Tromsø, Norway' }
    ],
    droughtDetection: [
        { lat: 34.0522, lon: -118.2437, color: 'yellow', label: 'Drought Detection - Los Angeles, CA' },
        { lat: 36.7783, lon: -119.4179, color: 'yellow', label: 'Drought Detection - California, USA' },
        { lat: 30.2672, lon: -97.7431, color: 'yellow', label: 'Drought Detection - Austin, TX' },
        { lat: 33.4484, lon: -112.0740, color: 'yellow', label: 'Drought Detection - Phoenix, AZ' },
        { lat: 23.6345, lon: -102.5528, color: 'yellow', label: 'Drought Detection - Mexico' }
    ]
};

// Function to show events on the map and populate the city list
function showEvent(eventType) {
    const events = eventData[eventType];
    const cityList = document.getElementById("city-list");

    // Remove previous markers
    currentMarkers.forEach(marker => {
        map.removeLayer(marker);
    });
    currentMarkers = []; // Reset current markers

    // Clear the city list
    cityList.innerHTML = '<ul></ul>';

    if (events) {
        // Add new markers and populate the city list
        events.forEach(event => {
            // Add a circle overlay to represent the city and color it based on the event
            const marker = L.circle([event.lat, event.lon], {
                color: event.color,
                fillColor: event.color,
                fillOpacity: 0.5,
                radius: 5000 // Adjust radius as needed
            }).addTo(map).bindPopup(event.label).openPopup();

            currentMarkers.push(marker);

            // Create a list item for the city
            const listItem = document.createElement('li');
            listItem.textContent = event.label;
            listItem.onclick = () => {
                map.setView([event.lat, event.lon], 10); // Zoom to the city
            };

            // Append the list item to the city list
            cityList.querySelector('ul').appendChild(listItem);
        });
    }
}

// Socket event listeners for real-time location updates
socket.on("received-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude]);

    if (currentOverlay) {
        currentOverlay.setLatLng([latitude, longitude]);
    } else {
        currentOverlay = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
    if (currentOverlay) {
        map.removeLayer(currentOverlay);
        currentOverlay = null;
    }
});
