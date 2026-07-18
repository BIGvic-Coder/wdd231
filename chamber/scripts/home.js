// Lagos Chamber of Commerce - Homepage Logic
// Fetches weather data (OpenWeatherMap API) and member spotlights (members.json)

document.addEventListener("DOMContentLoaded", () => {
  // --- CONFIGURATION ---
  const LAT = 6.5244;
  const LON = 3.3792;
  // Replace this placeholder with your own API key if desired
  const API_KEY = "5db72008fa626b9cc8c1f9c3132e01df"; 

  // --- INIT FUNCTIONS ---
  initWeather(LAT, LON, API_KEY);
  initSpotlights();
});

// --- WEATHER API LOGIC ---
async function initWeather(lat, lon, apiKey) {
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  try {
    // 1. Fetch Current Weather
    const currentResponse = await fetch(currentUrl);
    if (!currentResponse.ok) throw new Error("Current weather API response error");
    const currentData = await currentResponse.json();
    displayCurrentWeather(currentData);

    // 2. Fetch Forecast Weather
    const forecastResponse = await fetch(forecastUrl);
    if (!forecastResponse.ok) throw new Error("Forecast weather API response error");
    const forecastData = await forecastResponse.json();
    displayForecast(forecastData);

  } catch (error) {
    console.warn("Weather API fetch failed. Using fallback mock data.", error);
    showMockWeather();
  }
}

// Display retrieved current weather data
function displayCurrentWeather(data) {
  const tempElement = document.getElementById("current-temp");
  const descElement = document.getElementById("weather-desc");
  const iconElement = document.getElementById("weather-icon");
  const humidityElement = document.getElementById("humidity");
  const windElement = document.getElementById("wind-speed");

  if (tempElement) tempElement.textContent = Math.round(data.main.temp);
  if (humidityElement) humidityElement.textContent = data.main.humidity;
  if (windElement) windElement.textContent = data.wind.speed.toFixed(1);

  if (descElement) {
    const description = data.weather[0].description;
    // Capitalize each word
    descElement.textContent = description
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  if (iconElement) {
    const iconCode = data.weather[0].icon;
    iconElement.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    iconElement.alt = data.weather[0].description;
    iconElement.style.display = "block";
  }
}

// Parse and display 3-day forecast data
function displayForecast(data) {
  const forecastContainer = document.getElementById("forecast-container");
  if (!forecastContainer) return;

  const forecastList = data.list;
  const dailyForecasts = {};
  const todayStr = new Date().toDateString();

  // Group forecasts by calendar day
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dayStr = date.toDateString();

    // Ignore today's remaining hours
    if (dayStr === todayStr) return;

    if (!dailyForecasts[dayStr]) {
      dailyForecasts[dayStr] = [];
    }
    dailyForecasts[dayStr].push(item);
  });

  // Get the next 3 days
  const sortedDays = Object.keys(dailyForecasts).sort((a, b) => new Date(a) - new Date(b));
  const nextThreeDays = sortedDays.slice(0, 3);

  // Clear placeholder
  forecastContainer.innerHTML = "";

  nextThreeDays.forEach(dayStr => {
    const readings = dailyForecasts[dayStr];
    // Find reading closest to 12:00 PM (noon)
    const noonReading = readings.find(r => r.dt_txt.includes("12:00:00")) || readings[Math.floor(readings.length / 2)];

    const dateObj = new Date(dayStr);
    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
    const temp = Math.round(noonReading.main.temp);
    const iconCode = noonReading.weather[0].icon;
    const desc = noonReading.weather[0].description;

    const forecastDay = document.createElement("div");
    forecastDay.className = "forecast-day";
    forecastDay.innerHTML = `
      <span class="forecast-label">${dayName}</span>
      <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${desc}" class="forecast-icon">
      <span class="forecast-temp">${temp}°C</span>
    `;
    forecastContainer.appendChild(forecastDay);
  });
}

// Fallback logic for offline mode / invalid API keys
function showMockWeather() {
  const tempElement = document.getElementById("current-temp");
  const descElement = document.getElementById("weather-desc");
  const iconElement = document.getElementById("weather-icon");
  const humidityElement = document.getElementById("humidity");
  const windElement = document.getElementById("wind-speed");

  if (tempElement) tempElement.textContent = "29";
  if (descElement) descElement.textContent = "Partly Cloudy (Simulated)";
  if (humidityElement) humidityElement.textContent = "76";
  if (windElement) windElement.textContent = "4.2";

  if (iconElement) {
    iconElement.src = "https://openweathermap.org/img/wn/03d@2x.png";
    iconElement.alt = "scattered clouds";
    iconElement.style.display = "block";
  }

  const forecastContainer = document.getElementById("forecast-container");
  if (forecastContainer) {
    forecastContainer.innerHTML = "";

    // Generate upcoming 3 days dynamically
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const todayIndex = new Date().getDay();

    const mockTemps = [28, 30, 27];
    const mockIcons = ["02d", "01d", "10d"];
    const mockDescs = ["few clouds", "clear sky", "light rain"];

    for (let i = 0; i < 3; i++) {
      const nextDayName = weekdays[(todayIndex + 1 + i) % 7];
      const temp = mockTemps[i];
      const icon = mockIcons[i];
      const desc = mockDescs[i];

      const forecastDay = document.createElement("div");
      forecastDay.className = "forecast-day";
      forecastDay.innerHTML = `
        <span class="forecast-label">${nextDayName}</span>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}" class="forecast-icon">
        <span class="forecast-temp">${temp}°C</span>
      `;
      forecastContainer.appendChild(forecastDay);
    }
  }
}

// --- MEMBER SPOTLIGHTS LOGIC ---
async function initSpotlights() {
  const spotlightContainer = document.getElementById("spotlight-container");
  if (!spotlightContainer) return;

  try {
    const response = await fetch("data/members.json");
    if (!response.ok) throw new Error("Failed to load members JSON");
    const members = await response.json();

    // Filter by membership tier: 2 (Silver) or 3 (Gold)
    const qualifiedMembers = members.filter(m => m.membership === 2 || m.membership === 3);

    if (qualifiedMembers.length === 0) {
      spotlightContainer.innerHTML = "<p class='no-spotlight'>No spotlight partners available.</p>";
      return;
    }

    // Shuffle and pick 3 random members
    const shuffled = [...qualifiedMembers].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    // Clear placeholder
    spotlightContainer.innerHTML = "";

    selected.forEach(member => {
      const isGold = member.membership === 3;
      const badgeText = isGold ? "Gold Partner" : "Silver Partner";
      const badgeClass = isGold ? "gold-badge" : "silver-badge";
      const tierClass = isGold ? "gold-tier" : "silver-tier";

      const card = document.createElement("div");
      card.className = `spotlight-card ${tierClass}`;
      card.innerHTML = `
        <div class="spotlight-header">
          <span class="membership-badge ${badgeClass}">${badgeText}</span>
        </div>
        <div class="logo-wrapper">
          <img src="images/${member.image}" alt="${member.name} Logo" class="spotlight-logo" loading="lazy">
        </div>
        <h3>${member.name}</h3>
        <p class="tagline">"${member.tagline}"</p>
        <hr class="card-divider">
        <div class="spotlight-details">
          <p class="detail-item">📍 <span class="val">${member.address}</span></p>
          <p class="detail-item">📞 <span class="val">${member.phone}</span></p>
          <p class="detail-item font-semibold">🌐 <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a></p>
        </div>
      `;
      spotlightContainer.appendChild(card);
    });

  } catch (error) {
    console.error("Spotlight rendering error:", error);
    spotlightContainer.innerHTML = "<p class='no-spotlight'>Failed to load business spotlights.</p>";
  }
}
