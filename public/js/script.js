const socket = io(); //Initalize the socket.io iski madad se connection req backend pe jati hai which should handle at app.js

if(navigator.geolocation){
    //track the psoition and form positon take corrdinates
    navigator.geolocation.watchPosition((position)=>{
        const {latitude, longitude} = position.coords;
        //position se coords nikale and backend mai bhejdia
        socket.emit("send-location", {latitude, longitude})
    },(error)=>{
        console.log(error)
    },
{
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
});
}

// use leaflet
//we are getting a map and set view 
const map = L.map("map").setView([0,0],16);
// to see world map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution: "Xavier Rodgriues"
}).addTo(map)

const markers = {};
//when we get a message from backend
socket.on("received-location", (data) => {
    const {id, latitude, longitude} = data;
    //got the location from the backend and set it in the map it will show your current location
    map.setView([latitude,longitude]);

    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }else{
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    }
});

socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})