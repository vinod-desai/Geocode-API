let lat1, lng1, lat2, lng2;
// Get location form 1
const locationForm1 = document.getElementById('location-form-1');

// Listen for submit
locationForm1.addEventListener('submit', geocode1);

// Get location form 2
const locationForm2 = document.getElementById('location-form-2');

// Listen for submit
locationForm2.addEventListener('submit', geocode2);

function geocode1(e) {
    // Prevent actual submit
    e.preventDefault();
    geocode(1);
}

function geocode2(e) {
    // Prevent actual submit
    e.preventDefault();
    geocode(2);
}

// Call Geocode
function geocode(id) {

    let location = document.getElementById(`location-input-${id}`).value;

    axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            address: location,
            key: 'AIzaSyCy4XrQs8eHU4fk4pADxa6qcBZyFz1EHO4'
        }
    })
        .then(function (response) {
            // Log full response
            console.log(response);

            // Formatted Address
            var formattedAddress = response.data.results[0].formatted_address;
            var formattedAddressOutput = `
      <ul class="list-group">
        <li class="list-group-item">${formattedAddress}</li>
      </ul>
    `;

            // Address Components
            let addressComponents = response.data.results[0].address_components;
            let addressComponentsOutput = '<ul class="list-group">';
            for (var i = 0; i < addressComponents.length; i++) {
                addressComponentsOutput += `
        <li class="list-group-item"><strong>${addressComponents[i].types[0]}</strong>: ${addressComponents[i].long_name}</li>
      `;
            }
            addressComponentsOutput += '</ul>';

            // Geometry
            let lat = response.data.results[0].geometry.location.lat;
            let lng = response.data.results[0].geometry.location.lng;
            let geometryOutput = `
      <ul class="list-group">
        <li class="list-group-item"><strong>Latitude</strong>: ${lat}</li>
        <li class="list-group-item"><strong>Longitude</strong>: ${lng}</li>
      </ul>
    `;
            if (id === 1) {
                lat1 = lat;
                lng1 = lng;
                // console.log(`Latitude-1 ${lat1} Longitude-1 ${lng1}`);
            } else {
                lat2 = lat;
                lng2 = lng;
            }
            // Output to app
            document.getElementById(`formatted-address-${id}`).innerHTML = formattedAddressOutput;
            document.getElementById(`address-components-${id}`).innerHTML = addressComponentsOutput;
            document.getElementById(`geometry-${id}`).innerHTML = geometryOutput;
        })
        .catch(function (error) {
            console.log(error);
        });
}

// Get Calculate Distance button
const calDistBtn = document.getElementById('calBtn');

// Listen for click event
calDistBtn.addEventListener('click', calDistance);

// convert Degrees to Radians
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

// Calculate distance between address 1 & address 2
function calDistance() {

    // lat1 = 12.9716; lng1 = 77.5946; lat2 = 11.0168; lng2 = 76.9558; -- test Values
    if (lat1 === undefined || lat2 === undefined || lng1 === undefined || lng2 === undefined) {
        alert("Enter Address 1 and Address 2");
    }

    let earthRadiusKm = 6371;

    let dLat = degreesToRadians(lat2 - lat1);
    let dLon = degreesToRadians(lng2 - lng1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    document.querySelector('#distance').innerHTML = `<h3> Distance: ${parseFloat(earthRadiusKm * c).toFixed(2)} Miles</h3>`;

}