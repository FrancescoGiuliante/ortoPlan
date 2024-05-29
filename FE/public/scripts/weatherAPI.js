async function getWeather() {
    const city = document.getElementById('cityInput').value;
    const apiKey = "b0a3aec6fbd58bd2729579cfe364775b";
    const url = 'http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        document.getElementById('weatherInfo').innerHTML = <p>${error.message}</p>;
    }
}

function displayWeather(data) {
    const weatherInfoDiv = document.getElementById('weatherInfo');
    const temp = data.main.temp;
    const weather = data.weather[0].description;
    const city = data.name;
    weatherInfoDiv.innerHTML = <p>The weather in ${city} is currently ${weather} with a temperature of ${temp}°C.</p>;

    console.log(data.weather[0].main);
}