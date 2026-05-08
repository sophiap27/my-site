const bgMusic = document.getElementById('bg-music');
const clickSound = document.getElementById('click-sound');
const audioToggle = document.getElementById('audio-toggle');
const findMeBtn = document.getElementById('find-me');
const resultsGrid = document.getElementById('results-grid');

// 1. Audio Logic
let isPlaying = false;
audioToggle.addEventListener('click', () => {
    isPlaying = !isPlaying;
    isPlaying ? bgMusic.play() : bgMusic.pause();
    audioToggle.innerHTML = isPlaying ? '🔊' : '  🔇';
    playClick();
});

function playClick() {
    clickSound.currentTime = 0;
    clickSound.play();
}

// 2. Data Fetching (Overpass API)
findMeBtn.addEventListener('click', () => {
    playClick();
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }
    
    document.getElementById('status-msg').innerText = "Scanning local grid...";
    navigator.geolocation.getCurrentPosition(fetchBusinesses);
});

async function fetchBusinesses(position) {
    const { latitude, longitude } = position.coords;
    // Overpass QL Query: Finding shops/cafes in a 1km radius
    const query = `[out:json];node(around:1000,${latitude},${longitude})[shop];out 10;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        renderResults(data.elements);
    } catch (error) {
        console.error("API Error:", error);
        document.getElementById('status-msg').innerText = "Failed to fetch local data.";
    }
}

function renderResults(elements) {
    resultsGrid.innerHTML = '';
    document.getElementById('status-msg').innerText = `Found ${elements.length} locations nearby.`;

    elements.forEach(el => {
        const name = el.tags.name || "Unnamed Business";
        const type = el.tags.shop || "Store";
        
        // Mocking holiday status check (Technical Depth: In a real app, 
        // you'd parse el.tags.opening_hours using a library like 'opening_hours')
        const isOpen = Math.random() > 0.5; 

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${name}</h3>
            <p>${type}</p>
            <p class="${isOpen ? 'status-open' : 'status-closed'}">
                ${isOpen ? '● Currently Open' : '○ Closed for Holiday'}
            </p>
        `;
        resultsGrid.appendChild(card);
    });
}
