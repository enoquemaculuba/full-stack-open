function getAllCountries() {
  const response = fetch(
    "https://studies.cs.helsinki.fi/restcountries/api/all"
  );
  return response.then((response) => response.json());
}

function getCountryWeatherData(country) {
  const response = fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${country.latlng[0]}&longitude=${country.latlng[1]}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`
  );
  return response.then((response) => response.json());
}

export { getAllCountries, getCountryWeatherData };
