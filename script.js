let service, geocoder;
const clickSound = document.getElementById('click-sound');
const bgMusic = document.getElementById('bg-music');
let musicPlaying = false;

function initApp() {
    geocoder = new google.maps.Geocoder();
    service = new google.maps.places.PlacesService(document.createElement('div'));
    
    document.getElementById('search-btn').addEventListener('click', () => {
        playSound();
        findBusinesses();
    });

    document.getElementById('music-toggle').addEventListener('click', toggleMusic);
}

// 1. Live Weather API Integration (Public API)
async function fetchWeather(city) {
    const weatherDisplay = document.getElementById('weather-widget');
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true`);
        const data = await response.json();
        document.getElementById('temp').innerText = `${data.current_weather.temperature}°C`;
        document.getElementById('weather-desc').innerText = "Vibe: Crisp";
        weatherDisplay.classList.remove('weather-hide');
    } catch (e) {
        console.log("Weather service unavailable");
    }
}

// 2. Sound Interaction
function playSound() {
    clickSound.currentTime = 0;
    clickSound.play();
}

function toggleMusic() {
    if (!musicPlaying) {
        bgMusic.play();
        bgMusic.volume = 0.2;
        document.getElementById('music-toggle').style.background = "var(--accent)";
        document.getElementById('music-toggle').style.color = "var(--bg)";
    } else {
        bgMusic.pause();
        document.getElementById('music-toggle').style.background = "transparent";
        document.getElementById('music-toggle').style.color = "var(--accent)";
    }
    musicPlaying = !musicPlaying;
}

// 3. Places Logic
function findBusinesses() {
    const locationText = document.getElementById('location-input').value;
    const businessType = document.getElementById('type-input').value;
    const container = document.getElementById('results-container');

    if (!locationText) return;

    container.innerHTML = `<div class="status-msg">Scanning the area...</div>`;
    fetchWeather(locationText); // Trigger secondary API

    geocoder.geocode({ address: locationText }, (results, status) => {
        if (status === "OK") {
            const loc = results[0].geometry.location;
            const request = { location: loc, radius: '4000', type: [businessType] };
            
            service.nearbySearch(request, (results, status) => {
                container.innerHTML = "";
                if (status === "OK") {
                    results.forEach(place => renderCard(place));
                }
            });
        }
    });
}

function renderCard(place) {
    const container = document.getElementById('results-container');
    const isOpen = place.opening_hours ? place.opening_hours.isOpen() : null;
    
    const card = document.createElement('div');
    card.className = 'business-card';
    card.innerHTML = `
        <div>
            <h3 style="margin:0">${place.name}</h3>
            <p style="margin:5px 0; color: var(--text-dim)">${place.vicinity}</p>
        </div>
        <div class="${isOpen ? 'open-status' : 'closed-status'}">
            ${isOpen === null ? 'UNKNOWN' : (isOpen ? '● OPEN' : '○ CLOSED')}
        </div>
    `;
    container.appendChild(card);
}
