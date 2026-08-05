import {
  getWeatherByCity,
  getWeatherByCoordinates,
  getWeatherByLocation,
  searchCities,
} from "./api.js";

import {
  clearSearchMessage,
  hideSearchSuggestions,
  renderFavoriteCities,
  renderRecentSearches,
  renderSearchSuggestions,
  renderWeather,
  setActiveSuggestion,
  setFavoriteButtonState,
  setSearchMessage,
  showError,
  showLoading,
} from "./ui.js";


/* =========================================================
   DEFAULT
========================================================= */

const DEFAULT_CITY =
  "Kolkata";


/* =========================================================
   STORAGE
========================================================= */

const THEME_STORAGE_KEY =
  "weathernow-theme";

const RECENT_SEARCHES_KEY =
  "weathernow-recent-searches";

const TEMPERATURE_UNIT_KEY =
  "weathernow-temperature-unit";

const FAVORITES_STORAGE_KEY =
  "weathernow-favorite-cities";


/* =========================================================
   SETTINGS
========================================================= */

const MAX_RECENT_SEARCHES =
  6;

const MAX_FAVORITES =
  8;

const MIN_SEARCH_LENGTH =
  3;

const SEARCH_DEBOUNCE_DELAY =
  400;


/* =========================================================
   STATE
========================================================= */

let currentTemperatureUnit =
  "celsius";

let currentLocation =
  null;

let searchSuggestionsData =
  [];

let activeSuggestionIndex =
  -1;

let searchTimeout =
  null;

let searchRequestId =
  0;


/* =========================================================
   ELEMENTS
========================================================= */

const searchForm =
  document.getElementById(
    "searchForm"
  );

const cityInput =
  document.getElementById(
    "cityInput"
  );

const searchSuggestions =
  document.getElementById(
    "searchSuggestions"
  );

const headerSearchForm =
  document.getElementById(
    "headerSearchForm"
  );

const headerCityInput =
  document.getElementById(
    "headerCityInput"
  );

const locationButton =
  document.getElementById(
    "locationButton"
  );

const locationButtonIcon =
  document.getElementById(
    "locationButtonIcon"
  );

const locationButtonText =
  document.getElementById(
    "locationButtonText"
  );

const heroLocationButton =
  document.getElementById(
    "heroLocationButton"
  );

const themeButton =
  document.getElementById(
    "themeButton"
  );

const themeIcon =
  document.getElementById(
    "themeIcon"
  );

const celsiusButton =
  document.getElementById(
    "celsiusButton"
  );

const fahrenheitButton =
  document.getElementById(
    "fahrenheitButton"
  );

const recentSearchesList =
  document.getElementById(
    "recentSearchesList"
  );

const clearRecentButton =
  document.getElementById(
    "clearRecentButton"
  );

const favoriteButton =
  document.getElementById(
    "favoriteButton"
  );

const favoriteCitiesList =
  document.getElementById(
    "favoriteCitiesList"
  );

const clearFavoritesButton =
  document.getElementById(
    "clearFavoritesButton"
  );


/* =========================================================
   THEME
========================================================= */

function getSystemTheme() {
  return window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches
    ? "dark"
    : "light";
}


function getSavedTheme() {
  return localStorage.getItem(
    THEME_STORAGE_KEY
  );
}


function applyTheme(theme) {
  document.documentElement
    .dataset.theme =
      theme;


  const dark =
    theme === "dark";


  themeIcon.textContent =
    dark
      ? "☀️"
      : "🌙";


  themeButton.title =
    dark
      ? "Switch to light mode"
      : "Switch to dark mode";


  themeButton.setAttribute(
    "aria-label",
    themeButton.title
  );
}


function initializeTheme() {
  applyTheme(
    getSavedTheme() ||
    getSystemTheme()
  );
}


function toggleTheme() {
  const current =
    document.documentElement
      .dataset.theme;


  const next =
    current === "dark"
      ? "light"
      : "dark";


  applyTheme(next);


  localStorage.setItem(
    THEME_STORAGE_KEY,
    next
  );
}


/* =========================================================
   TEMPERATURE UNIT
========================================================= */

function getSavedTemperatureUnit() {
  const unit =
    localStorage.getItem(
      TEMPERATURE_UNIT_KEY
    );


  return unit === "fahrenheit"
    ? "fahrenheit"
    : "celsius";
}


function updateUnitButtons() {
  const celsius =
    currentTemperatureUnit ===
    "celsius";


  celsiusButton.classList.toggle(
    "active",
    celsius
  );


  fahrenheitButton.classList.toggle(
    "active",
    !celsius
  );


  celsiusButton.setAttribute(
    "aria-pressed",
    String(celsius)
  );


  fahrenheitButton.setAttribute(
    "aria-pressed",
    String(!celsius)
  );
}


function initializeTemperatureUnit() {
  currentTemperatureUnit =
    getSavedTemperatureUnit();


  updateUnitButtons();
}


async function changeTemperatureUnit(
  unit
) {
  if (
    unit !== "celsius" &&
    unit !== "fahrenheit"
  ) {
    return;
  }


  if (
    unit === currentTemperatureUnit
  ) {
    return;
  }


  currentTemperatureUnit =
    unit;


  localStorage.setItem(
    TEMPERATURE_UNIT_KEY,
    unit
  );


  updateUnitButtons();


  if (currentLocation) {
    await reloadCurrentWeather();
  }
}


/* =========================================================
   RECENT SEARCHES
========================================================= */

function getRecentSearches() {
  const saved =
    localStorage.getItem(
      RECENT_SEARCHES_KEY
    );


  if (!saved) {
    return [];
  }


  try {
    const parsed =
      JSON.parse(saved);


    return Array.isArray(parsed)
      ? parsed
      : [];

  } catch (error) {

    console.error(
      "Recent searches error:",
      error
    );


    return [];
  }
}


function saveRecentSearches(
  cities
) {
  localStorage.setItem(
    RECENT_SEARCHES_KEY,
    JSON.stringify(cities)
  );
}


function addRecentSearch(
  city
) {
  let searches =
    getRecentSearches();


  searches =
    searches.filter(
      (savedCity) =>
        savedCity.toLowerCase() !==
        city.toLowerCase()
    );


  searches.unshift(city);


  searches =
    searches.slice(
      0,
      MAX_RECENT_SEARCHES
    );


  saveRecentSearches(
    searches
  );


  renderRecentSearches(
    searches
  );
}


function clearRecentSearches() {
  localStorage.removeItem(
    RECENT_SEARCHES_KEY
  );


  renderRecentSearches(
    []
  );


  setSearchMessage(
    "Recent searches cleared."
  );
}


function initializeRecentSearches() {
  renderRecentSearches(
    getRecentSearches()
  );
}


/* =========================================================
   FAVORITES
========================================================= */

function createFavoriteKey(
  location
) {
  if (
    location.id !== null &&
    location.id !== undefined
  ) {
    return `id-${location.id}`;
  }


  const latitude =
    Number(
      location.latitude
    ).toFixed(4);


  const longitude =
    Number(
      location.longitude
    ).toFixed(4);


  return [
    location.name,
    latitude,
    longitude,
  ]
    .join("-")
    .toLowerCase();
}


function normalizeFavoriteLocation(
  location
) {
  return {
    id:
      location.id ?? null,

    favoriteKey:
      createFavoriteKey(
        location
      ),

    name:
      location.name || "",

    state:
      location.state || "",

    country:
      location.country || "",

    countryCode:
      location.countryCode || "",

    latitude:
      location.latitude,

    longitude:
      location.longitude,

    timezone:
      location.timezone || "",
  };
}


function getFavorites() {
  const saved =
    localStorage.getItem(
      FAVORITES_STORAGE_KEY
    );


  if (!saved) {
    return [];
  }


  try {
    const parsed =
      JSON.parse(saved);


    if (
      !Array.isArray(parsed)
    ) {
      return [];
    }


    return parsed
      .filter(
        (location) =>
          location &&
          location.name &&
          location.latitude !== undefined &&
          location.longitude !== undefined
      )
      .map(
        (location) =>
          normalizeFavoriteLocation(
            location
          )
      );

  } catch (error) {

    console.error(
      "Favorites parsing error:",
      error
    );


    return [];
  }
}


function saveFavorites(
  favorites
) {
  localStorage.setItem(
    FAVORITES_STORAGE_KEY,
    JSON.stringify(favorites)
  );
}


function isLocationFavorite(
  location
) {
  if (!location) {
    return false;
  }


  const key =
    createFavoriteKey(
      location
    );


  return getFavorites().some(
    (favorite) =>
      favorite.favoriteKey ===
      key
  );
}


function updateCurrentFavoriteButton() {
  setFavoriteButtonState(
    currentLocation
      ? isLocationFavorite(
          currentLocation
        )
      : false
  );
}


function initializeFavorites() {
  renderFavoriteCities(
    getFavorites()
  );


  updateCurrentFavoriteButton();
}


function addFavorite(
  location
) {
  if (!location) {
    return;
  }


  const normalized =
    normalizeFavoriteLocation(
      location
    );


  let favorites =
    getFavorites();


  const exists =
    favorites.some(
      (favorite) =>
        favorite.favoriteKey ===
        normalized.favoriteKey
    );


  if (exists) {
    return;
  }


  favorites.unshift(
    normalized
  );


  favorites =
    favorites.slice(
      0,
      MAX_FAVORITES
    );


  saveFavorites(
    favorites
  );


  renderFavoriteCities(
    favorites
  );


  updateCurrentFavoriteButton();
}


function removeFavorite(
  favoriteKey
) {
  const favorites =
    getFavorites().filter(
      (favorite) =>
        favorite.favoriteKey !==
        favoriteKey
    );


  saveFavorites(
    favorites
  );


  renderFavoriteCities(
    favorites
  );


  updateCurrentFavoriteButton();
}


function clearFavorites() {
  localStorage.removeItem(
    FAVORITES_STORAGE_KEY
  );


  renderFavoriteCities(
    []
  );


  updateCurrentFavoriteButton();


  setSearchMessage(
    "All favorite cities cleared."
  );
}


function toggleCurrentFavorite() {
  if (!currentLocation) {
    return;
  }


  if (
    currentLocation.name ===
    "Current Location"
  ) {
    setSearchMessage(
      "Search for a city before adding it to favorites."
    );

    return;
  }


  const favorite =
    isLocationFavorite(
      currentLocation
    );


  if (favorite) {
    removeFavorite(
      createFavoriteKey(
        currentLocation
      )
    );


    setSearchMessage(
      `${currentLocation.name} removed from favorites.`
    );

    return;
  }


  addFavorite(
    currentLocation
  );


  setSearchMessage(
    `${currentLocation.name} added to favorites.`
  );
}


/* =========================================================
   AUTOCOMPLETE
========================================================= */

function resetAutocomplete() {
  searchSuggestionsData =
    [];


  activeSuggestionIndex =
    -1;


  hideSearchSuggestions();
}


function handleSearchInput() {
  const query =
    cityInput.value.trim();


  activeSuggestionIndex =
    -1;


  if (searchTimeout) {
    clearTimeout(
      searchTimeout
    );
  }


  if (
    query.length <
    MIN_SEARCH_LENGTH
  ) {
    resetAutocomplete();

    return;
  }


  searchTimeout =
    setTimeout(
      () => {
        loadSearchSuggestions(
          query
        );
      },
      SEARCH_DEBOUNCE_DELAY
    );
}


async function loadSearchSuggestions(
  query
) {
  const requestId =
    ++searchRequestId;


  try {
    const locations =
      await searchCities(
        query,
        6
      );


    if (
      requestId !==
      searchRequestId
    ) {
      return;
    }


    if (
      cityInput.value
        .trim()
        .toLowerCase() !==
      query.toLowerCase()
    ) {
      return;
    }


    searchSuggestionsData =
      locations;


    activeSuggestionIndex =
      -1;


    renderSearchSuggestions(
      locations
    );

  } catch (error) {

    console.error(
      "Autocomplete error:",
      error
    );


    if (
      requestId ===
      searchRequestId
    ) {
      resetAutocomplete();
    }
  }
}


async function selectSuggestion(
  index
) {
  const location =
    searchSuggestionsData[
      index
    ];


  if (!location) {
    return;
  }


  cityInput.value =
    location.name;


  resetAutocomplete();


  await loadWeatherFromLocation(
    location
  );
}


function handleSearchKeydown(
  event
) {
  if (
    searchSuggestionsData.length ===
    0
  ) {
    if (
      event.key === "Escape"
    ) {
      resetAutocomplete();
    }

    return;
  }


  if (
    event.key ===
    "ArrowDown"
  ) {
    event.preventDefault();


    activeSuggestionIndex++;


    if (
      activeSuggestionIndex >=
      searchSuggestionsData.length
    ) {
      activeSuggestionIndex =
        0;
    }


    setActiveSuggestion(
      activeSuggestionIndex
    );

    return;
  }


  if (
    event.key ===
    "ArrowUp"
  ) {
    event.preventDefault();


    activeSuggestionIndex--;


    if (
      activeSuggestionIndex < 0
    ) {
      activeSuggestionIndex =
        searchSuggestionsData.length -
        1;
    }


    setActiveSuggestion(
      activeSuggestionIndex
    );

    return;
  }


  if (
    event.key === "Enter" &&
    activeSuggestionIndex >= 0
  ) {
    event.preventDefault();


    selectSuggestion(
      activeSuggestionIndex
    );

    return;
  }


  if (
    event.key ===
    "Escape"
  ) {
    resetAutocomplete();
  }
}


/* =========================================================
   LOAD WEATHER FROM LOCATION
========================================================= */

async function loadWeatherFromLocation(
  location
) {
  clearSearchMessage();

  showLoading();


  try {
    const result =
      await getWeatherByLocation(
        location,
        currentTemperatureUnit
      );


    currentLocation =
      result.location;


    renderWeather(
      result.location,
      result.weather,
      currentTemperatureUnit
    );


    updateCurrentFavoriteButton();


    cityInput.value =
      result.location.name;


    addRecentSearch(
      result.location.name
    );


    setSearchMessage(
      `Showing live weather for ${result.location.name}${
        result.location.country
          ? `, ${result.location.country}`
          : ""
      }.`
    );

  } catch (error) {

    console.error(
      "Weather loading error:",
      error
    );


    showError(
      error.message ||
        "Unable to load weather data."
    );
  }
}


/* =========================================================
   LOAD WEATHER BY CITY
========================================================= */

async function loadWeather(
  city,
  saveSearch = true
) {
  clearSearchMessage();

  resetAutocomplete();

  showLoading();


  try {
    const {
      location,
      weather,
    } =
      await getWeatherByCity(
        city,
        currentTemperatureUnit
      );


    currentLocation =
      location;


    renderWeather(
      location,
      weather,
      currentTemperatureUnit
    );


    updateCurrentFavoriteButton();


    cityInput.value =
      location.name;


    if (saveSearch) {
      addRecentSearch(
        location.name
      );
    }


    setSearchMessage(
      `Showing live weather for ${location.name}${
        location.country
          ? `, ${location.country}`
          : ""
      }.`
    );

  } catch (error) {

    console.error(
      "Weather loading error:",
      error
    );


    showError(
      error.message ||
        "Unable to load weather data."
    );
  }
}


/* =========================================================
   COORDINATE WEATHER
========================================================= */

async function loadWeatherByCoordinates(
  latitude,
  longitude
) {
  clearSearchMessage();

  resetAutocomplete();

  showLoading();


  try {
    const {
      location,
      weather,
    } =
      await getWeatherByCoordinates(
        latitude,
        longitude,
        currentTemperatureUnit
      );


    currentLocation =
      location;


    renderWeather(
      location,
      weather,
      currentTemperatureUnit
    );


    updateCurrentFavoriteButton();


    cityInput.value =
      "";


    setSearchMessage(
      "Showing weather for your current location."
    );

  } catch (error) {

    console.error(
      "Location weather error:",
      error
    );


    showError(
      error.message ||
        "Unable to load weather for your location."
    );
  }
}


/* =========================================================
   RELOAD CURRENT WEATHER
========================================================= */

async function reloadCurrentWeather() {
  if (!currentLocation) {
    return;
  }


  showLoading();


  try {
    const {
      location,
      weather,
    } =
      await getWeatherByLocation(
        currentLocation,
        currentTemperatureUnit
      );


    currentLocation =
      location;


    renderWeather(
      location,
      weather,
      currentTemperatureUnit
    );


    updateCurrentFavoriteButton();


    const symbol =
      currentTemperatureUnit ===
      "fahrenheit"
        ? "°F"
        : "°C";


    setSearchMessage(
      `Temperature unit changed to ${symbol}.`
    );

  } catch (error) {

    console.error(
      "Weather reload error:",
      error
    );


    showError(
      error.message ||
        "Unable to update weather."
    );
  }
}


/* =========================================================
   SEARCH FORM
========================================================= */

searchForm.addEventListener(
  "submit",
  async (
    event
  ) => {
    event.preventDefault();


    const city =
      cityInput.value.trim();


    if (!city) {
      setSearchMessage(
        "Please enter a city name."
      );


      cityInput.focus();

      return;
    }


    await loadWeather(city);
  }
);


/* =========================================================
   HERO INPUT
========================================================= */

cityInput.addEventListener(
  "input",
  handleSearchInput
);


cityInput.addEventListener(
  "keydown",
  handleSearchKeydown
);


/* =========================================================
   HEADER SEARCH
========================================================= */

headerSearchForm.addEventListener(
  "submit",
  async (
    event
  ) => {
    event.preventDefault();


    const city =
      headerCityInput.value.trim();


    if (!city) {
      return;
    }


    cityInput.value =
      city;


    await loadWeather(
      city
    );


    headerCityInput.value =
      "";
  }
);


/* =========================================================
   AUTOCOMPLETE CLICK
========================================================= */

searchSuggestions.addEventListener(
  "click",
  async (
    event
  ) => {
    const button =
      event.target.closest(
        ".suggestion-item"
      );


    if (!button) {
      return;
    }


    await selectSuggestion(
      Number(
        button.dataset.index
      )
    );
  }
);


/* =========================================================
   CLICK OUTSIDE AUTOCOMPLETE
========================================================= */

document.addEventListener(
  "click",
  (
    event
  ) => {
    if (
      !searchForm.contains(
        event.target
      )
    ) {
      resetAutocomplete();
    }
  }
);


/* =========================================================
   RECENT CITY
========================================================= */

recentSearchesList.addEventListener(
  "click",
  async (
    event
  ) => {
    const button =
      event.target.closest(
        ".recent-city-button"
      );


    if (!button) {
      return;
    }


    const city =
      button.dataset.city;


    if (city) {
      await loadWeather(city);
    }
  }
);


clearRecentButton.addEventListener(
  "click",
  clearRecentSearches
);


/* =========================================================
   FAVORITES
========================================================= */

favoriteButton.addEventListener(
  "click",
  toggleCurrentFavorite
);


favoriteCitiesList.addEventListener(
  "click",
  async (
    event
  ) => {
    const removeButton =
      event.target.closest(
        ".favorite-remove-button"
      );


    if (removeButton) {
      const key =
        removeButton.dataset.key;


      const favorite =
        getFavorites().find(
          (item) =>
            item.favoriteKey ===
            key
        );


      removeFavorite(key);


      if (favorite) {
        setSearchMessage(
          `${favorite.name} removed from favorites.`
        );
      }


      return;
    }


    const cityButton =
      event.target.closest(
        ".favorite-city-button"
      );


    if (!cityButton) {
      return;
    }


    const location =
      getFavorites().find(
        (favorite) =>
          favorite.favoriteKey ===
          cityButton.dataset.key
      );


    if (location) {
      await loadWeatherFromLocation(
        location
      );
    }
  }
);


clearFavoritesButton.addEventListener(
  "click",
  clearFavorites
);


/* =========================================================
   GEOLOCATION
========================================================= */

function resetLocationButtons() {
  locationButton.disabled =
    false;


  heroLocationButton.disabled =
    false;


  locationButtonIcon.textContent =
    "📍";


  locationButtonText.textContent =
    "My Location";


  heroLocationButton.textContent =
    "📍";
}


async function handleLocationSuccess(
  position
) {
  try {
    await loadWeatherByCoordinates(
      position.coords.latitude,
      position.coords.longitude
    );

  } finally {

    resetLocationButtons();

  }
}


function handleLocationError(
  error
) {
  let message =
    "Unable to access your location.";


  switch (error.code) {

    case error.PERMISSION_DENIED:

      message =
        "Location permission was denied. Please allow location access in your browser.";

      break;


    case error.POSITION_UNAVAILABLE:

      message =
        "Your location is currently unavailable.";

      break;


    case error.TIMEOUT:

      message =
        "Getting your location took too long. Please try again.";

      break;


    default:

      message =
        "Unable to determine your current location.";
  }


  resetLocationButtons();

  showError(message);
}


function handleLocationClick() {
  resetAutocomplete();


  if (
    !navigator.geolocation
  ) {
    showError(
      "Your browser does not support location services."
    );

    return;
  }


  locationButton.disabled =
    true;


  heroLocationButton.disabled =
    true;


  locationButtonIcon.textContent =
    "⏳";


  locationButtonText.textContent =
    "Locating";


  heroLocationButton.textContent =
    "⏳";


  setSearchMessage(
    "Getting your current location..."
  );


  navigator.geolocation
    .getCurrentPosition(
      handleLocationSuccess,
      handleLocationError,
      {
        enableHighAccuracy:
          true,

        timeout:
          10000,

        maximumAge:
          300000,
      }
    );
}


locationButton.addEventListener(
  "click",
  handleLocationClick
);


heroLocationButton.addEventListener(
  "click",
  handleLocationClick
);


/* =========================================================
   TEMPERATURE
========================================================= */

celsiusButton.addEventListener(
  "click",
  async () => {
    await changeTemperatureUnit(
      "celsius"
    );
  }
);


fahrenheitButton.addEventListener(
  "click",
  async () => {
    await changeTemperatureUnit(
      "fahrenheit"
    );
  }
);


/* =========================================================
   THEME
========================================================= */

themeButton.addEventListener(
  "click",
  toggleTheme
);


const systemThemeMedia =
  window.matchMedia(
    "(prefers-color-scheme: dark)"
  );


systemThemeMedia.addEventListener(
  "change",
  (
    event
  ) => {
    if (
      getSavedTheme()
    ) {
      return;
    }


    applyTheme(
      event.matches
        ? "dark"
        : "light"
    );
  }
);


/* =========================================================
   START APP
========================================================= */

initializeTheme();

initializeTemperatureUnit();

initializeRecentSearches();

initializeFavorites();


loadWeather(
  DEFAULT_CITY,
  false
);