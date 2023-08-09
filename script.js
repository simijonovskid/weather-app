// API KEY : c16e2c9d050748858c9210151230507
// https://api.weatherapi.com/v1/current.json?key=c16e2c9d050748858c9210151230507&q=London&aqi=no
// GEOCODING https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}
// GEOCODING https://geocode.xyz/${lat},${lng}?json=1
// OPWENWEATHER API KEY : a9dcd121273b110b324a9acd0b2633a8
// http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}
let city;

navigator.geolocation.getCurrentPosition(
    async function getCity(pos) {
        const { latitude: lat, longitude: long } = pos.coords;
        console.log(lat, long);
        const geocode = await fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${long}`);
        const data = await geocode.json();
        console.log('DATA GEOCODING', data.address.city);
        city = data.address.city;
    },
    err => console.log('Error getting your location', err)
);

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const form = document.querySelector('#form');
const loc = document.querySelector('.city-name');
const temp = document.querySelector('.temperature');
const searchForm = document.querySelector('#search-form');
const condition = document.querySelector('.condition');
const conditionImg = document.querySelector('.condition-img');
const input = document.querySelector('.input');
const humidity = document.querySelector('.humidity-measurement');
const wind = document.querySelector('.wind-measurement');
const forecastWrapper = document.querySelector('.forecast-wrapper');
const country = document.querySelector('.country');

const forecastHTML = data => {
    const date = new Date(data.date);
    const dayOfTheWeek = WEEKDAY[date.getDay()];
    console.log('date', date);

    return `<div class="forecast">
    <img
        src=${data.day.condition.icon}
        alt="condition-img"
    />
    <div class="day-of-week">${dayOfTheWeek}</div>
    <div class="temp-forecast">${data.day.maxtemp_c} °C</div>
</div>`;
};

const renderData = data => {
    console.log('DATA', data);
    forecastWrapper.innerHTML = '';
    temp.textContent = `${data.current.temp_c} °C`;
    loc.textContent = data.location.name;
    condition.textContent = data.current.condition.text;
    conditionImg.src = data.current.condition.icon;
    humidity.textContent = `${data.current.humidity} %`;
    wind.textContent = `${data.current.wind_kph} km/h`;
    country.textContent = `${data.location.region}, ${data.location.country}`;

    data.forecast.forecastday.map(day => {
        forecastWrapper.insertAdjacentHTML('beforeend', forecastHTML(day));
    });
};

const fetchWeather = async location => {
    const weatherData = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=c16e2c9d050748858c9210151230507&q=${location}&days=4&aqi=no&alerts=no`
    );

    input.classList.remove('red-border');

    if (!weatherData.ok) input.classList.add('red-border');

    const data = await weatherData.json();

    console.log('DATA WEATHER', data);

    renderData(data);
};

searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const inputValue = e.target.querySelector('input').value.trim();
    fetchWeather(inputValue);
});

window.addEventListener('DOMContentLoaded', fetchWeather('London'));