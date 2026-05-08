window.onload = function() {
    console.log("App initialized");
    
    // Check if Google Maps loaded correctly
    if (typeof google === 'undefined') {
        document.getElementById('status-msg').innerHTML = 
            "<b style='color:red'>Error: Google Maps API not loaded. Check your API key!</b>";
        return;
    }

    document.getElementById('search-btn').addEventListener('click', findBusinesses);
};

function findBusinesses() {
    const locationText = document.getElementById('location-input').value;
    const businessType = document.getElementById('type-input').value;
    const container = document.getElementById('results-container');

    console.log(`Searching for ${businessType} in ${locationText}`);
    
    container.innerHTML = "Searching live data...";

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: locationText }, (results, status) => {
        if (status === "OK") {
            const location = results[0].geometry.location;
            fetchPlaces(location, businessType);
        } else {
            console.error("Geocode failed: " + status);
            container.innerHTML = "Location not found. Error: " + status;
        }
    });
}

// ... keep the rest of the previous script.js ...
