import { API_KEY } from './apikey.js';

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



const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const forecastHTML = data => {
    const date = new Date(data.date);
    const dayOfTheWeek = WEEKDAY[date.getDay()];

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
    forecastWrapper.innerHTML = '';
    temp.textContent = `${data.current.temp_c} °C`;
    loc.textContent = data.location.name;
    condition.textContent = data.current.condition.text;
    conditionImg.src = data.current.condition.icon;
    humidity.textContent = `${data.current.humidity} %`;
    wind.textContent = `${data.current.wind_kph} km/h`;
    country.textContent = `${data.location.region}, ${data.location.country}`;

    data.forecast.forecastday?.map(day => {
        forecastWrapper.insertAdjacentHTML('beforeend', forecastHTML(day));
    });
};

const fetchWeather = async location => {
    try {
        const weatherData = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=4&aqi=no&alerts=no`
        );

        input.classList.remove('red-border');

        if (!weatherData.ok) {
            input.classList.add('red-border');
            alert("That city does not exist. Try another one")
            console.log('weather data', weatherData);
            return;
        }
        const data = await weatherData.json();

        renderData(data);
    } catch (error) {
        alert(error);
    }
};

searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const inputValue = e.target.querySelector('input').value.trim();
    fetchWeather(inputValue);
});

navigator.geolocation.getCurrentPosition(
    async function getCity(pos) {
        const { latitude: lat, longitude: long } = pos.coords;
        console.log(lat, long);
        window.addEventListener('DOMContentLoaded', fetchWeather(lat+" " +long));
    },
    err => {
        console.log('Error getting your location', err)
        fetchWeather('London')
    }
);



