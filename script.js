let service;
let geocoder;

// This function runs automatically once Google Maps loads
function initMap() {
    console.log("Google Maps API loaded successfully.");
    geocoder = new google.maps.Geocoder();
    // We need a dummy div for the PlacesService to work without a visible map
    service = new google.maps.places.PlacesService(document.createElement('div'));
    
    // Attach the event listener AFTER we know Google is ready
    document.getElementById('search-btn').addEventListener('click', findBusinesses);
}

function findBusinesses() {
    const locationText = document.getElementById('location-input').value;
    const businessType = document.getElementById('type-input').value;
    const container = document.getElementById('results-container');

    if (!locationText) {
        alert("Please enter a city or zip code.");
        return;
    }

    container.innerHTML = `<div class="status-msg">Searching live data for ${locationText}...</div>`;

    geocoder.geocode({ address: locationText }, (results, status) => {
        if (status === "OK") {
            const location = results[0].geometry.location;
            console.log("Location found:", location.lat(), location.lng());
            fetchPlaces(location, businessType);
        } else {
            console.error("Geocode failed:", status);
            container.innerHTML = `<div class="status-msg">Error: Could not find that location (${status}).</div>`;
        }
    });
}

function fetchPlaces(location, type) {
    const request = {
        location: location,
        radius: '5000',
        type: [type]
    };

    service.nearbySearch(request, (results, status) => {
        const container = document.getElementById('results-container');
        container.innerHTML = "";

        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(place => createCard(place));
        } else {
            console.warn("Places Search status:", status);
            container.innerHTML = `<div class="status-msg">No ${type}s found nearby or API limit reached.</div>`;
        }
    });
}

function createCard(place) {
    const container = document.getElementById('results-container');
    // Important: opening_hours is only returned if the API key has Billing enabled
    const isOpen = place.opening_hours ? place.opening_hours.isOpen() : null;
    
    const card = document.createElement('div');
    card.className = 'business-card';
    
    card.innerHTML = `
        <div>
            <h3 style="margin:0">${place.name}</h3>
            <p style="margin:5px 0; color: #666; font-size: 0.9rem;">${place.vicinity}</p>
        </div>
        <div>
            <span class="${isOpen ? 'open-badge' : 'closed-badge'}">
                ${isOpen === null ? 'Unknown' : (isOpen ? 'OPEN' : 'CLOSED')}
            </span>
        </div>
    `;
    
    container.appendChild(card);
}
