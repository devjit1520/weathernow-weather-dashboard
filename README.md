# WeatherNow 🌦️

A premium, responsive weather dashboard built with HTML, CSS, and modern JavaScript. WeatherNow uses real-time weather data to provide current conditions, forecasts, geolocation, saved cities, recent searches, theme preferences, and Celsius/Fahrenheit switching.

## Live Demo

https://weathernow-weather-dashboard.vercel.app

## Features

- Real-time weather data
- Search weather by city
- City autocomplete suggestions
- Keyboard navigation for suggestions
- Current-location weather with the Geolocation API
- Current temperature and weather condition
- Feels-like temperature
- Humidity
- Wind speed
- Visibility
- Atmospheric pressure
- Next 8-hour forecast
- 7-day forecast
- Celsius / Fahrenheit switching
- Light and dark themes
- Favorite cities
- Recent searches
- LocalStorage persistence
- Loading and error states
- Responsive desktop, tablet, and mobile layout

## Tech Stack

- HTML5
- CSS3
- JavaScript ES6+
- ES Modules
- Fetch API
- Geolocation API
- LocalStorage
- Open-Meteo Weather API
- Open-Meteo Geocoding API
- Vercel

## Project Structure

```text
weather-dashboard/
├── assets/
├── css/
│   └── style.css
├── js/
│   ├── api.js
│   ├── app.js
│   ├── ui.js
│   └── utils.js
├── index.html
└── README.md
```

## Main Functionality

### City Search
Users can search for a city and receive live weather information.

### Autocomplete
WeatherNow requests matching locations while the user types and displays selectable city suggestions.

### Current Location
The browser Geolocation API can retrieve the user's coordinates and load weather for the current location.

### Forecasts
The application displays current weather, the next 8 hours, and a complete 7-day forecast.

### Favorite Cities
Users can save frequently checked cities and open them again with one click.

### Recent Searches
Recent city searches are stored locally and remain available after refreshing the browser.

### Temperature Units
Users can switch between Celsius and Fahrenheit, and the selected preference is saved in LocalStorage.

### Theme
WeatherNow supports light and dark themes and remembers the selected theme.

## APIs

WeatherNow uses the free Open-Meteo Weather and Geocoding APIs. No API key is required for the current implementation.

## Run Locally

```bash
git clone https://github.com/devjit1520/weathernow-weather-dashboard.git
cd weathernow-weather-dashboard
```

Open the project with a local static server such as Live Server.

## Learning Goals

This project was created to strengthen practical JavaScript skills, including:

- Functions and application logic
- Arrays and objects
- DOM manipulation
- Event listeners
- ES modules
- Async/await
- Fetch API
- JSON
- Error handling
- Debouncing
- Event delegation
- Browser storage
- Geolocation
- Dynamic rendering
- Application state

## Future Improvements

- Air quality data
- UV index
- Sunrise and sunset
- Weather charts
- Precipitation details
- Reverse geocoding
- Dynamic weather backgrounds
- Additional accessibility improvements

## Author

**Devjit Mondal**  
Frontend Developer
