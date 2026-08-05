/* =========================================================
   ROUND NUMBER
========================================================= */

export function roundNumber(number) {
  return Math.round(number);
}


/* =========================================================
   FORMAT TEMPERATURE
========================================================= */

export function formatTemperature(
  temperature
) {
  return `${roundNumber(temperature)}°`;
}


/* =========================================================
   CREATE UTC DATE
========================================================= */

function createUTCDate(
  dateString
) {
  const datePart =
    dateString.split("T")[0];


  const [
    year,
    month,
    day,
  ] =
    datePart
      .split("-")
      .map(Number);


  return new Date(
    Date.UTC(
      year,
      month - 1,
      day
    )
  );
}


/* =========================================================
   FULL DATE
========================================================= */

export function formatFullDate(
  dateString
) {
  const date =
    createUTCDate(
      dateString
    );


  return new Intl.DateTimeFormat(
    "en-US",
    {
      weekday:
        "long",

      day:
        "numeric",

      month:
        "long",

      timeZone:
        "UTC",
    }
  ).format(date);
}


/* =========================================================
   WEEKDAY
========================================================= */

export function formatWeekday(
  dateString
) {
  const date =
    createUTCDate(
      dateString
    );


  return new Intl.DateTimeFormat(
    "en-US",
    {
      weekday:
        "long",

      timeZone:
        "UTC",
    }
  ).format(date);
}


/* =========================================================
   SHORT DATE
========================================================= */

export function formatShortDate(
  dateString
) {
  const date =
    createUTCDate(
      dateString
    );


  return new Intl.DateTimeFormat(
    "en-US",
    {
      month:
        "short",

      day:
        "numeric",

      timeZone:
        "UTC",
    }
  ).format(date);
}


/* =========================================================
   HOUR
========================================================= */

export function formatHour(
  dateTimeString
) {
  const time =
    dateTimeString
      .split("T")[1];


  const hour =
    Number(
      time.split(":")[0]
    );


  if (hour === 0) {
    return "12 AM";
  }


  if (hour === 12) {
    return "12 PM";
  }


  if (hour > 12) {
    return `${hour - 12} PM`;
  }


  return `${hour} AM`;
}


/* =========================================================
   VISIBILITY
========================================================= */

export function formatVisibility(
  meters
) {
  if (
    meters === null ||
    meters === undefined
  ) {
    return "N/A";
  }


  const kilometers =
    meters / 1000;


  if (
    kilometers >= 10
  ) {
    return `${Math.round(kilometers)} km`;
  }


  return `${kilometers.toFixed(1)} km`;
}


/* =========================================================
   WEATHER CODE INFORMATION
========================================================= */

export function getWeatherInfo(
  code,
  isDay = 1
) {
  const day =
    Number(isDay) === 1;


  switch (code) {

    case 0:
      return {
        description:
          "Clear Sky",

        icon:
          day
            ? "☀️"
            : "🌙",

        summary:
          "Clear and pleasant weather.",
      };


    case 1:
      return {
        description:
          "Mainly Clear",

        icon:
          day
            ? "🌤️"
            : "🌙",

        summary:
          "Mostly clear conditions.",
      };


    case 2:
      return {
        description:
          "Partly Cloudy",

        icon:
          day
            ? "⛅"
            : "☁️",

        summary:
          "A mix of clouds and clear sky.",
      };


    case 3:
      return {
        description:
          "Overcast",

        icon:
          "☁️",

        summary:
          "Cloudy conditions expected.",
      };


    case 45:
    case 48:
      return {
        description:
          "Fog",

        icon:
          "🌫️",

        summary:
          "Reduced visibility due to fog.",
      };


    case 51:
    case 53:
    case 55:
      return {
        description:
          "Drizzle",

        icon:
          "🌦️",

        summary:
          "Light drizzle in the area.",
      };


    case 56:
    case 57:
      return {
        description:
          "Freezing Drizzle",

        icon:
          "🌧️",

        summary:
          "Freezing drizzle conditions.",
      };


    case 61:
      return {
        description:
          "Light Rain",

        icon:
          "🌧️",

        summary:
          "Light rainfall expected.",
      };


    case 63:
      return {
        description:
          "Moderate Rain",

        icon:
          "🌧️",

        summary:
          "Moderate rainfall expected.",
      };


    case 65:
      return {
        description:
          "Heavy Rain",

        icon:
          "🌧️",

        summary:
          "Heavy rainfall expected.",
      };


    case 66:
    case 67:
      return {
        description:
          "Freezing Rain",

        icon:
          "🌧️",

        summary:
          "Freezing rain conditions.",
      };


    case 71:
    case 73:
    case 75:
      return {
        description:
          "Snow",

        icon:
          "❄️",

        summary:
          "Snowfall expected.",
      };


    case 77:
      return {
        description:
          "Snow Grains",

        icon:
          "🌨️",

        summary:
          "Snow grains in the area.",
      };


    case 80:
    case 81:
    case 82:
      return {
        description:
          "Rain Showers",

        icon:
          "🌦️",

        summary:
          "Rain showers expected.",
      };


    case 85:
    case 86:
      return {
        description:
          "Snow Showers",

        icon:
          "🌨️",

        summary:
          "Snow showers expected.",
      };


    case 95:
      return {
        description:
          "Thunderstorm",

        icon:
          "⛈️",

        summary:
          "Thunderstorms possible.",
      };


    case 96:
    case 99:
      return {
        description:
          "Thunderstorm with Hail",

        icon:
          "⛈️",

        summary:
          "Thunderstorms with hail possible.",
      };


    default:
      return {
        description:
          "Weather",

        icon:
          "🌤️",

        summary:
          "Weather information available.",
      };
  }
}