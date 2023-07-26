import React, { useState, useEffect } from "react";
import * as countryService from "../services/countryService";

const CountrySearch = () => {
  const [countries, setCountries] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      setCountries(await countryService.getAllCountries());
    };
    fetchCountries();
  }, []);
  const countriesToShow =
    input === ""
      ? []
      : countries.filter((country) =>
          country.name.common.toLowerCase().includes(input.toLowerCase())
        );
  return (
    <div>
      <p>
        find countries{" "}
        <input value={input} onChange={(e) => setInput(e.target.value)} />
      </p>
      <CountryList
        countries={countriesToShow}
        setInput={(country) => setInput(country)}
      />
    </div>
  );
};

const CountryList = ({ countries, setInput }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }
  if (countries.length === 1) {
    return <CountryItem country={countries[0]} />;
  }
  return (
    <div>
      {countries.map((country) => (
        <div>
          <p style={{ display: "inline-block" }} key={country.name.common}>
            {country.name.common}
          </p>
          <button onClick={() => setInput(country.name.common)}>show</button>
        </div>
      ))}
    </div>
  );
};

const CountryItem = ({ country }) => {
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    const fetchWeather = async () => {
      country &&
        setWeather(await countryService.getCountryWeatherData(country));
    };
    fetchWeather();
  }, [country]);
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <b>languages:</b>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt="flag" width="200" />
      {weather && (
        <div>
          <h2>Weather in {country.capital[0]}</h2>
          <p>
            <b>temperature:</b> {weather.current_weather.temperature} Celsius
          </p>
          <p>
            <b>wind:</b> {weather.current_weather.windspeed} m/s
          </p>
        </div>
      )}
    </div>
  );
};

export default CountrySearch;
