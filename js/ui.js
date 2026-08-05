import {
  formatFullDate,
  formatHour,
  formatShortDate,
  formatVisibility,
  formatWeekday,
  getWeatherInfo,
  roundNumber,
} from "./utils.js";


/* =========================================================
   GENERAL ELEMENTS
========================================================= */

const loadingState =
  document.getElementById(
    "loadingState"
  );

const errorState =
  document.getElementById(
    "errorState"
  );

const errorMessage =
  document.getElementById(
    "errorMessage"
  );

const weatherContent =
  document.getElementById(
    "weatherContent"
  );

const searchMessage =
  document.getElementById(
    "searchMessage"
  );


/* =========================================================
   CURRENT WEATHER
========================================================= */

const locationName =
  document.getElementById(
    "locationName"
  );

const currentDate =
  document.getElementById(
    "currentDate"
  );

const currentWeatherIcon =
  document.getElementById(
    "currentWeatherIcon"
  );

const currentTemperature =
  document.getElementById(
    "currentTemperature"
  );

const temperatureUnit =
  document.getElementById(
    "temperatureUnit"
  );

const weatherCondition =
  document.getElementById(
    "weatherCondition"
  );

const weatherSummary =
  document.querySelector(
    ".weather-summary"
  );

const feelsLike =
  document.getElementById(
    "feelsLike"
  );

const humidity =
  document.getElementById(
    "humidity"
  );

const windSpeed =
  document.getElementById(
    "windSpeed"
  );

const visibility =
  document.getElementById(
    "visibility"
  );

const pressure =
  document.getElementById(
    "pressure"
  );


/* =========================================================
   FAVORITES
========================================================= */

const favoriteButton =
  document.getElementById(
    "favoriteButton"
  );

const favoriteIcon =
  document.getElementById(
    "favoriteIcon"
  );

const favoriteCitiesSection =
  document.getElementById(
    "favoriteCitiesSection"
  );

const favoriteCitiesList =
  document.getElementById(
    "favoriteCitiesList"
  );


/* =========================================================
   FORECAST
========================================================= */

const hourlyForecast =
  document.getElementById(
    "hourlyForecast"
  );

const weeklyForecast =
  document.getElementById(
    "weeklyForecast"
  );


/* =========================================================
   RECENT
========================================================= */

const recentSearchesSection =
  document.getElementById(
    "recentSearchesSection"
  );

const recentSearchesList =
  document.getElementById(
    "recentSearchesList"
  );


/* =========================================================
   AUTOCOMPLETE
========================================================= */

const searchSuggestions =
  document.getElementById(
    "searchSuggestions"
  );


/* =========================================================
   UNIT SYMBOL
========================================================= */

function getTemperatureSymbol(
  unit
) {
  return unit === "fahrenheit"
    ? "°F"
    : "°C";
}


/* =========================================================
   LOADING
========================================================= */

export function showLoading() {
  loadingState.classList.remove(
    "hidden"
  );


  errorState.classList.add(
    "hidden"
  );


  weatherContent.classList.add(
    "hidden"
  );
}


export function hideLoading() {
  loadingState.classList.add(
    "hidden"
  );
}


/* =========================================================
   ERROR
========================================================= */

export function showError(
  message
) {
  hideLoading();


  weatherContent.classList.add(
    "hidden"
  );


  errorState.classList.remove(
    "hidden"
  );


  errorMessage.textContent =
    message;
}


export function hideError() {
  errorState.classList.add(
    "hidden"
  );
}


/* =========================================================
   SHOW WEATHER
========================================================= */

export function showWeatherContent() {
  hideLoading();

  hideError();


  weatherContent.classList.remove(
    "hidden"
  );
}


/* =========================================================
   SEARCH MESSAGE
========================================================= */

export function setSearchMessage(
  message
) {
  searchMessage.textContent =
    message;
}


export function clearSearchMessage() {
  searchMessage.textContent =
    "";
}


/* =========================================================
   LOCATION
========================================================= */

function renderLocation(
  location
) {
  const parts = [
    location.name,
    location.state,
    location.country,
  ].filter(Boolean);


  locationName.textContent =
    parts.join(", ");
}


/* =========================================================
   CURRENT WEATHER
========================================================= */

function renderCurrentWeather(
  weather,
  unit
) {
  const current =
    weather.current;


  const unitSymbol =
    getTemperatureSymbol(
      unit
    );


  const info =
    getWeatherInfo(
      current.weather_code,
      current.is_day
    );


  currentDate.textContent =
    formatFullDate(
      current.time
    );


  currentWeatherIcon.textContent =
    info.icon;


  currentTemperature.textContent =
    roundNumber(
      current.temperature_2m
    );


  temperatureUnit.textContent =
    unitSymbol;


  weatherCondition.textContent =
    info.description;


  weatherSummary.textContent =
    info.summary;


  feelsLike.textContent =
    `${roundNumber(
      current.apparent_temperature
    )}${unitSymbol}`;


  humidity.textContent =
    `${roundNumber(
      current.relative_humidity_2m
    )}%`;


  windSpeed.textContent =
    `${roundNumber(
      current.wind_speed_10m
    )} km/h`;


  visibility.textContent =
    formatVisibility(
      current.visibility
    );


  pressure.textContent =
    `${roundNumber(
      current.surface_pressure
    )} hPa`;
}


/* =========================================================
   CURRENT HOUR INDEX
========================================================= */

function findCurrentHourIndex(
  hourlyTimes,
  currentTime
) {
  const currentHour =
    currentTime.slice(
      0,
      13
    );


  const index =
    hourlyTimes.findIndex(
      (time) =>
        time.startsWith(
          currentHour
        )
    );


  return index >= 0
    ? index
    : 0;
}


/* =========================================================
   HOURLY
========================================================= */

function renderHourlyForecast(
  weather
) {
  const hourly =
    weather.hourly;


  const startIndex =
    findCurrentHourIndex(
      hourly.time,
      weather.current.time
    );


  const endIndex =
    Math.min(
      startIndex + 8,
      hourly.time.length
    );


  const cards = [];


  for (
    let index = startIndex;
    index < endIndex;
    index++
  ) {
    const info =
      getWeatherInfo(
        hourly.weather_code[index],
        hourly.is_day[index]
      );


    const label =
      index === startIndex
        ? "Now"
        : formatHour(
            hourly.time[index]
          );


    const rain =
      hourly
        .precipitation_probability[
          index
        ] ?? 0;


    cards.push(`
      <article
        class="hour-card ${
          index === startIndex
            ? "active"
            : ""
        }"
      >

        <p>
          ${label}
        </p>

        <span
          class="hour-icon"
          title="${info.description}"
        >
          ${info.icon}
        </span>

        <strong>
          ${roundNumber(
            hourly.temperature_2m[
              index
            ]
          )}°
        </strong>

        <small>
          💧 ${roundNumber(rain)}%
        </small>

      </article>
    `);
  }


  hourlyForecast.innerHTML =
    cards.join("");
}


/* =========================================================
   WEEKLY
========================================================= */

function renderWeeklyForecast(
  weather
) {
  const daily =
    weather.daily;


  const currentDateValue =
    weather.current.time
      .split("T")[0];


  const cards =
    daily.time.map(
      (
        date,
        index
      ) => {
        const info =
          getWeatherInfo(
            daily.weather_code[index],
            1
          );


        const dayName =
          date === currentDateValue
            ? "Today"
            : formatWeekday(date);


        return `
          <article class="day-card">

            <div class="day-info">

              <strong>
                ${dayName}
              </strong>

              <span>
                ${formatShortDate(
                  date
                )}
              </span>

            </div>


            <div class="day-condition">

              <span>
                ${info.icon}
              </span>

              <p>
                ${info.description}
              </p>

            </div>


            <div class="day-temperature">

              <strong>
                ${roundNumber(
                  daily
                    .temperature_2m_max[
                      index
                    ]
                )}°
              </strong>

              <span>
                ${roundNumber(
                  daily
                    .temperature_2m_min[
                      index
                    ]
                )}°
              </span>

            </div>

          </article>
        `;
      }
    );


  weeklyForecast.innerHTML =
    cards.join("");
}


/* =========================================================
   COMPLETE WEATHER
========================================================= */

export function renderWeather(
  location,
  weather,
  unit = "celsius"
) {
  renderLocation(
    location
  );


  renderCurrentWeather(
    weather,
    unit
  );


  renderHourlyForecast(
    weather
  );


  renderWeeklyForecast(
    weather
  );


  showWeatherContent();
}


/* =========================================================
   FAVORITE BUTTON
========================================================= */

export function setFavoriteButtonState(
  isFavorite
) {
  favoriteButton.classList.toggle(
    "active",
    isFavorite
  );


  favoriteIcon.textContent =
    isFavorite
      ? "★"
      : "☆";


  favoriteButton.setAttribute(
    "aria-pressed",
    isFavorite
      ? "true"
      : "false"
  );


  favoriteButton.setAttribute(
    "aria-label",
    isFavorite
      ? "Remove city from favorites"
      : "Save city to favorites"
  );


  favoriteButton.title =
    isFavorite
      ? "Remove from favorites"
      : "Save city";
}


/* =========================================================
   RECENT SEARCHES
========================================================= */

export function renderRecentSearches(
  cities
) {
  recentSearchesList.innerHTML =
    "";


  if (
    !cities ||
    cities.length === 0
  ) {
    recentSearchesSection.classList.add(
      "hidden"
    );

    return;
  }


  recentSearchesSection.classList.remove(
    "hidden"
  );


  cities.forEach(
    (city) => {
      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "recent-city-button";


      button.dataset.city =
        city;


      button.textContent =
        city;


      recentSearchesList.append(
        button
      );
    }
  );
}


/* =========================================================
   FAVORITE CITIES
========================================================= */

export function renderFavoriteCities(
  favorites
) {
  favoriteCitiesList.innerHTML =
    "";


  if (
    !favorites ||
    favorites.length === 0
  ) {
    favoriteCitiesSection.classList.add(
      "hidden"
    );

    return;
  }


  favoriteCitiesSection.classList.remove(
    "hidden"
  );


  favorites.forEach(
    (location) => {
      const card =
        document.createElement(
          "article"
        );


      card.className =
        "favorite-city-card";


      const cityButton =
        document.createElement(
          "button"
        );


      cityButton.type =
        "button";


      cityButton.className =
        "favorite-city-button";


      cityButton.dataset.key =
        location.favoriteKey;


      const icon =
        document.createElement(
          "span"
        );


      icon.className =
        "favorite-city-icon";


      icon.textContent =
        "★";


      const text =
        document.createElement(
          "span"
        );


      text.className =
        "favorite-city-text";


      const name =
        document.createElement(
          "span"
        );


      name.className =
        "favorite-city-name";


      name.textContent =
        location.name;


      const secondary =
        document.createElement(
          "span"
        );


      secondary.className =
        "favorite-city-location";


      secondary.textContent =
        [
          location.state,
          location.country,
        ]
          .filter(Boolean)
          .join(", ");


      text.append(
        name,
        secondary
      );


      cityButton.append(
        icon,
        text
      );


      const removeButton =
        document.createElement(
          "button"
        );


      removeButton.type =
        "button";


      removeButton.className =
        "favorite-remove-button";


      removeButton.dataset.key =
        location.favoriteKey;


      removeButton.title =
        "Remove favorite";


      removeButton.setAttribute(
        "aria-label",
        `Remove ${location.name} from favorites`
      );


      removeButton.textContent =
        "×";


      card.append(
        cityButton,
        removeButton
      );


      favoriteCitiesList.append(
        card
      );
    }
  );
}


/* =========================================================
   AUTOCOMPLETE
========================================================= */

export function renderSearchSuggestions(
  locations
) {
  searchSuggestions.innerHTML =
    "";


  if (
    !locations ||
    locations.length === 0
  ) {
    hideSearchSuggestions();

    return;
  }


  locations.forEach(
    (
      location,
      index
    ) => {
      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "suggestion-item";


      button.dataset.index =
        index.toString();


      button.setAttribute(
        "role",
        "option"
      );


      button.setAttribute(
        "aria-selected",
        "false"
      );


      const main =
        document.createElement(
          "span"
        );


      main.className =
        "suggestion-main";


      const icon =
        document.createElement(
          "span"
        );


      icon.className =
        "suggestion-location-icon";


      icon.textContent =
        "📍";


      const text =
        document.createElement(
          "span"
        );


      text.className =
        "suggestion-text";


      const name =
        document.createElement(
          "span"
        );


      name.className =
        "suggestion-name";


      name.textContent =
        location.name;


      const secondary =
        document.createElement(
          "span"
        );


      secondary.className =
        "suggestion-location";


      secondary.textContent =
        [
          location.state,
          location.country,
        ]
          .filter(Boolean)
          .join(", ");


      const countryCode =
        document.createElement(
          "span"
        );


      countryCode.className =
        "suggestion-country-code";


      countryCode.textContent =
        location.countryCode ||
        "—";


      text.append(
        name,
        secondary
      );


      main.append(
        icon,
        text
      );


      button.append(
        main,
        countryCode
      );


      searchSuggestions.append(
        button
      );
    }
  );


  searchSuggestions.classList.remove(
    "hidden"
  );
}


/* =========================================================
   HIDE SUGGESTIONS
========================================================= */

export function hideSearchSuggestions() {
  searchSuggestions.classList.add(
    "hidden"
  );


  searchSuggestions.innerHTML =
    "";
}


/* =========================================================
   ACTIVE SUGGESTION
========================================================= */

export function setActiveSuggestion(
  activeIndex
) {
  const items =
    searchSuggestions.querySelectorAll(
      ".suggestion-item"
    );


  items.forEach(
    (
      item,
      index
    ) => {
      const active =
        index === activeIndex;


      item.classList.toggle(
        "active",
        active
      );


      item.setAttribute(
        "aria-selected",
        active
          ? "true"
          : "false"
      );


      if (active) {
        item.scrollIntoView({
          block:
            "nearest",
        });
      }
    }
  );
}