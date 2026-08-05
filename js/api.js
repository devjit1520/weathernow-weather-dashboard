/* =========================================================
   API URLS
========================================================= */

const GEOCODING_API_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API_URL =
  "https://api.open-meteo.com/v1/forecast";


/* =========================================================
   FETCH JSON
========================================================= */

async function fetchJSON(url) {
  const response =
    await fetch(url);


  if (!response.ok) {
    throw new Error(
      `Request failed with status ${response.status}.`
    );
  }


  const data =
    await response.json();


  if (data.error) {
    throw new Error(
      data.reason ||
        "Unable to load data."
    );
  }


  return data;
}


/* =========================================================
   NORMALIZE LOCATION
========================================================= */

function normalizeLocation(place) {
  return {
    id:
      place.id ?? null,

    name:
      place.name || "",

    country:
      place.country || "",

    countryCode:
      place.country_code || "",

    state:
      place.admin1 || "",

    latitude:
      place.latitude,

    longitude:
      place.longitude,

    timezone:
      place.timezone || "",
  };
}


/* =========================================================
   NORMALIZE UNIT
========================================================= */

function normalizeTemperatureUnit(
  unit
) {
  return unit === "fahrenheit"
    ? "fahrenheit"
    : "celsius";
}


/* =========================================================
   SEARCH MULTIPLE CITIES
========================================================= */

export async function searchCities(
  query,
  count = 6
) {
  const searchQuery =
    query.trim();


  if (
    searchQuery.length < 3
  ) {
    return [];
  }


  const params =
    new URLSearchParams({
      name:
        searchQuery,

      count:
        count.toString(),

      language:
        "en",

      format:
        "json",
    });


  const url =
    `${GEOCODING_API_URL}?${params.toString()}`;


  const data =
    await fetchJSON(url);


  if (
    !data.results
  ) {
    return [];
  }


  return data.results.map(
    normalizeLocation
  );
}


/* =========================================================
   SEARCH ONE CITY
========================================================= */

export async function searchCity(
  city
) {
  const searchQuery =
    city.trim();


  if (!searchQuery) {
    throw new Error(
      "Please enter a city name."
    );
  }


  const params =
    new URLSearchParams({
      name:
        searchQuery,

      count:
        "1",

      language:
        "en",

      format:
        "json",
    });


  const url =
    `${GEOCODING_API_URL}?${params.toString()}`;


  const data =
    await fetchJSON(url);


  if (
    !data.results ||
    data.results.length === 0
  ) {
    throw new Error(
      `We couldn't find "${searchQuery}". Try another city name.`
    );
  }


  return normalizeLocation(
    data.results[0]
  );
}


/* =========================================================
   WEATHER API
========================================================= */

export async function getWeather(
  latitude,
  longitude,
  temperatureUnit = "celsius"
) {
  const normalizedUnit =
    normalizeTemperatureUnit(
      temperatureUnit
    );


  const currentVariables = [
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "weather_code",
    "surface_pressure",
    "wind_speed_10m",
    "visibility",
    "is_day",
  ].join(",");


  const hourlyVariables = [
    "temperature_2m",
    "precipitation_probability",
    "weather_code",
    "is_day",
  ].join(",");


  const dailyVariables = [
    "weather_code",
    "temperature_2m_max",
    "temperature_2m_min",
  ].join(",");


  const params =
    new URLSearchParams({
      latitude:
        latitude.toString(),

      longitude:
        longitude.toString(),

      current:
        currentVariables,

      hourly:
        hourlyVariables,

      daily:
        dailyVariables,

      temperature_unit:
        normalizedUnit,

      timezone:
        "auto",

      forecast_days:
        "7",
    });


  const url =
    `${WEATHER_API_URL}?${params.toString()}`;


  return await fetchJSON(url);
}


/* =========================================================
   WEATHER BY CITY
========================================================= */

export async function getWeatherByCity(
  city,
  temperatureUnit = "celsius"
) {
  const location =
    await searchCity(city);


  const weather =
    await getWeather(
      location.latitude,
      location.longitude,
      temperatureUnit
    );


  return {
    location,
    weather,
  };
}


/* =========================================================
   WEATHER BY LOCATION OBJECT
========================================================= */

export async function getWeatherByLocation(
  location,
  temperatureUnit = "celsius"
) {
  if (
    !location ||
    location.latitude === undefined ||
    location.longitude === undefined
  ) {
    throw new Error(
      "Invalid location data."
    );
  }


  const weather =
    await getWeather(
      location.latitude,
      location.longitude,
      temperatureUnit
    );


  return {
    location,
    weather,
  };
}


/* =========================================================
   WEATHER BY COORDINATES
========================================================= */

export async function getWeatherByCoordinates(
  latitude,
  longitude,
  temperatureUnit = "celsius"
) {
  const weather =
    await getWeather(
      latitude,
      longitude,
      temperatureUnit
    );


  const location = {
    id:
      null,

    name:
      "Current Location",

    state:
      "",

    country:
      "",

    countryCode:
      "",

    latitude,

    longitude,

    timezone:
      weather.timezone || "",
  };


  return {
    location,
    weather,
  };
}