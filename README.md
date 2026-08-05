<<<<<<< HEAD
WeatherNow 🌦️

A premium, responsive weather dashboard built with HTML, CSS, and Vanilla JavaScript. WeatherNow uses real-time weather data to provide current conditions, hourly forecasts, 7-day forecasts, city autocomplete, geolocation, saved cities, recent searches, theme preferences, and Celsius/Fahrenheit switching.

Live Demo

Add your Vercel production URL here after deployment.

Features

Real-time weather data

Search weather by city

City autocomplete suggestions

Keyboard navigation for suggestions

Current location weather using the Geolocation API

Current temperature and weather condition

Feels-like temperature

Humidity

Wind speed

Visibility

Atmospheric pressure

Next 8-hour forecast

7-day forecast

Celsius and Fahrenheit switching

Saved temperature preference

Light and dark themes

Saved theme preference

Recent city searches

Favorite / saved cities

LocalStorage persistence

Loading and error states

Premium glassmorphism interface

Fully responsive desktop, tablet, and mobile layout

Tech Stack

HTML5

CSS3

Vanilla JavaScript

ES Modules

Fetch API

Geolocation API

LocalStorage

Open-Meteo Weather API

Open-Meteo Geocoding API

Vercel

Project Structure

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

Main Functionality

City Search

Users can search for a city and receive live weather information.

Autocomplete

WeatherNow requests matching locations while the user types and displays selectable city suggestions.

Current Location

The browser Geolocation API can retrieve the user's coordinates and load weather for the current location.

Forecasts

The application displays:

Current weather

Next 8 hours

Complete 7-day forecast

Favorite Cities

Users can save frequently checked cities and open them again with one click.

Recent Searches

Recent city searches are stored locally and remain available after refreshing the browser.

Temperature Units

Users can switch between:

Celsius (°C)

Fahrenheit (°F)

The selected preference is saved in LocalStorage.

Theme

WeatherNow supports light and dark themes and remembers the selected theme.

APIs

WeatherNow uses the free Open-Meteo APIs:

Weather Forecast API

Geocoding API

No API key is required for the current implementation.

Run Locally

Clone the repository:

git clone https://github.com/YOUR_GITHUB_USERNAME/weathernow-weather-dashboard.git

Open the project:

cd weathernow-weather-dashboard

You can then run the project using VS Code Live Server or another local static server.

For example:

http://127.0.0.1:5500/

Deployment

This project can be deployed as a static site on Vercel.

Production deployment using Vercel CLI:

vercel deploy --prod

Learning Goals

This project was created to strengthen practical JavaScript skills, including:

Variables and functions

Arrays and objects

DOM manipulation

Event listeners

ES modules

Async/await

Fetch API

JSON

Error handling

Debouncing

Event delegation

Browser storage

Geolocation

Dynamic rendering

Application state

Future Improvements

Possible future additions include:

Air quality data

UV index

Sunrise and sunset

Weather charts

Precipitation details

Reverse geocoding for current location

Dynamic weather backgrounds

Additional accessibility improvements

Author

Devjit Mondal

Frontend Developer

If you like this project, consider giving the repository a ⭐.
=======
# weathernow-weather-dashboard
Premium responsive real-time weather dashboard built with HTML, CSS and Vanilla JavaScript.
>>>>>>> d47eb03b4ea1214a5f5c6716750ba7849f49b60c
