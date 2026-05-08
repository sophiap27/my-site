document.getElementById('search-btn').addEventListener('click', findBusinesses);

function findBusinesses() {
    const locationText = document.getElementById('location-input').value;
    const businessType = document.getElementById('type-input').value;
    const container = document.getElementById('results-container');

    if (!locationText) {
        alert("Please enter a location");
        return;
    }

    container.innerHTML = "Searching live data...";

    // Use Google Geocoder to find lat/lng of the input location
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: locationText }, (results, status) => {
        if (status === "OK") {
            const location = results[0].geometry.location;
            fetchPlaces(location, businessType);
        } else {
            container.innerHTML = "Location not found. Try a different city.";
        }
    });
}

function fetchPlaces(location, type) {
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    
    const request = {
        location: location,
        radius: '5000', // 5km radius
        type: [type]
    };

    service.nearbySearch(request, (results, status) => {
        const container = document.getElementById('results-container');
        container.innerHTML = "";

        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(place => {
                createCard(place);
            });
        } else {
            container.innerHTML = "No businesses found in this area.";
        }
    });
}

function createCard(place) {
    const container = document.getElementById('results-container');
    const isOpen = place.opening_hours ? place.opening_hours.isOpen() : null;
    
    const card = document.createElement('div');
    card.className = 'business-card';
    
    card.innerHTML = `
        <div>
            <h3 style="margin:0">${place.name}</h3>
            <p style="margin:5px 0; color: #666;">${place.vicinity}</p>
        </div>
        <div>
            <span class="${isOpen ? 'open-badge' : 'closed-badge'}">
                ${isOpen === null ? 'Hours Unknown' : (isOpen ? 'OPEN' : 'CLOSED')}
            </span>
        </div>
    `;
    
    container.appendChild(card);
}
