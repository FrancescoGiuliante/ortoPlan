async function getWeatherNow(city) {
  const apiKey = "b0a3aec6fbd58bd2729579cfe364775b";
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('City not found');
      }
      const data = await response.json();
      displayWeather(data);
  } catch (error) {
      console.error('Errore durante il recupero del meteo:', error);
  }
}

function displayWeather(data) {
  const temp = data.main.temp;
  const weather = data.weather[0].description;
  const city = data.name;
  
  // Seleziona l'elemento <li> con name="meteo"
  const meteoElement = document.querySelector('[name="meteo"]');
  meteoElement.textContent = `Meteo attuale: ${weather} - Temperatura: ${temp}°C - Città: ${city}`;
}

//   async function getWeatherFour() {
//     const city = document.getElementById('cityInputFour').value;
//     const apiKey = "b0a3aec6fbd58bd2729579cfe364775b";
//     const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

//     try {
//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error('City not found');
//       }
//       const data = await response.json();
//       console.log(data);
//       // displayWeather(data);
//     } catch (error) {
//       document.getElementById('weatherInfo').innerHTML = `<p>${error.message}</p>`;
//     }
// }

// function displayWeather(data) {
//     const weatherInfoDiv = document.getElementById('weatherInfoFour');
//     weatherInfoDiv.innerHTML = '';  // Clear previous content

//     // Iterate through the forecast list and display data
//     data.list.forEach(forecast => {
//         const temp = forecast.main.temp;
//         const weather = forecast.weather[0].description;
//         const dateTime = new Date(forecast.dt * 1000).toLocaleString();

//         const forecastElement = document.createElement('p');
//         forecastElement.innerHTML = `At ${dateTime}, the weather will be ${weather} with a temperature of ${temp}°C.`;
//         weatherInfoDiv.appendChild(forecastElement);
//     });
// }
