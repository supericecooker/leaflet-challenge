
// Load the geojson data. 
var link = "static/data/data.geojson";
// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  // Creating a GeoJSON layer with the retrieved data
  createFeatures(data.features);
});

//creating function
function createFeatures(earthquakeData) {
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

   //Array that holds circles
   var circleArray = new Array();

   // Loop through data
   for (var i = 0; i < earthquakeData.length; i++) {
    // set data location
     coordinates = [earthquakeData[i].geometry.coordinates[1],earthquakeData[i].geometry.coordinates[0]]
     properties = earthquakeData[i].properties;
 
     var color = "#FF3333";
     if (properties.mag < 1) {
       color = "#FFA233";
     }
     else if (properties.mag < 2) {
       color = "#F9FF33";
     }
     else if (properties.mag < 3) {
       color = "#42FF33";
     }

     else if (properties.mag < 4) {
       color = "#33FFFC";
     }
     else if (properties.mag < 5) {
       color = "#3364FF";
     }
 
     // Add circles to map
     var circle = L.circle(coordinates, {
       fillOpacity: 0.4,
       color: color,
       fillColor: color,
       radius: (properties.mag * 10000)
     }).bindPopup("<h1>" + properties.place + "</h1> <hr> <h3>Magnitude: " + properties.mag.toFixed(2) + "</h3>");

     //push data circle
     circleArray.push(circle);
   }
 
   //Create the layer for the circles
   var earthquakes = L.layerGroup(circleArray);
 
   // Define a baseMaps object to hold our base layers
   var baseMaps = {
     "Street Map": streetmap,
     "Dark Map": darkmap
   };
 
   // Create overlay object to hold our overlay layer
   var overlayMaps = {
     Earthquakes: earthquakes
   };
 
   // Add map layer
   var myMap = L.map("map", {
     center: [37.09, -95.71],
     zoom: 5,
     layers: [streetmap,earthquakes]
   });
 
   L.control.layers(baseMaps,overlayMaps, {
      collapsed: false
   }).addTo(myMap);
 
   // adding legend
   var legend = L.control({position: 'bottomright'});
   legend.onAdd = function (map) {
     var div = L.DomUtil.create('div', 'legend');
     var labels = ["1", "2", "3", "4", "5", "5+"];
     var colors = ["#FF3333","#FFA233","#F9FF33","#42FF33","##33FFFC","##3364FF"];
 
     // legend background
     for (var i = 0; i < labels.length; i++) {
       div.innerHTML +=
          '<p style="margin-left: 30px">' + '<i style="background:' + colors[i] + ' "></i>' + '&nbsp;&nbsp;' + labels[i]+ '<\p>';
     }
     return div;
   };
 
   //Add the legend by default
   legend.addTo(myMap)
 
   myMap.on('overlayadd', function(a) {
     legend.addTo(myMap);
   });
   myMap.on('overlayremove', function(a) {
     myMap.removeControl(legend);
   });
 }
