/**
 * Start Global Variables
 */
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=',
  countryCode = ',us',
  // Personal API Key for OpenWeatherMap API
  apiKey = '&appid=29186dafa9e6a972f1b58d76a173e32b',
  units = '&units=metric', // Get the temperature in Celsius
  zip = document.querySelector('#zip'),
  feel = document.querySelector('#feeling'),
  error = document.querySelector('#error'),
  toGenerate = document.querySelector('.to-generate');
/**
 * End Global Variables
 */

/* Show form when foucs on input (Zip Code) */
zip.addEventListener('focus', () => {
  toGenerate.style.display = 'flex';
});

/*
 * Function called by event listener
 * Check fields
 * Calls a Function to get data from api
 * Collect the data
 * Calls a function to post the data
 * Calls a function to uptade UI
 */
const weatherByzip = () => {
  const zipeCode = zip.value;
  const feeling = feel.value;
  if (zipeCode === '' && feeling == '') {
    error.textContent = '*Fields are empty';
  } else if (feeling == '') {
    error.textContent = '*Enter your feeling';
  } else if (feeling.length > 50) {
    error.textContent = '*This is not an article :) ';
  } else if (zipeCode === '') {
    error.textContent = '*Zipe code is empty';
  } else if (isNaN(zipeCode) === true) {
    error.textContent = '*Zipe code should be Numbers ';
  } else {
    getWeather(zipeCode)
      .then((data) => {
        // Setup a varribale to collect data from API
        const collectData = {
          temp: Math.round(data.main.temp),
          tempMin: Math.round(data.main.temp_min),
          tempMax: Math.round(data.main.temp_max),
          feelsLike: Math.round(data.main.feels_like),
          pressure: data.main.pressure,
          humidity: data.main.humidity,
          visibility: data.visibility,
          wind: data.wind.speed,
          clouds: data.clouds.all,
          wDes: data.weather[0].description,
          icon: data.weather[0].icon,
          city: data.name,
          country: data.sys.country,
          date: Date().slice(0, 15),
          userResponse: feeling,
        };
        data = collectData;
        return data;
      })
      .then((data) => {
        // Called Function to Post data
        postData('/addWeatherData', data)
          .then(UI()) // Call Function to update UI
          .then(() => {
            toGenerate.style.display = 'none';
            error.textContent = '';
          });
      });
  }
};

/* Event listener to add function to get weather after checking the fields */
document.querySelector('#generate').addEventListener('click', weatherByzip);

/*
 * Function to GET Web API Data
 * Tells the user if there is an error
 */
const getWeather = async (zipeCode) => {
  const request = await fetch(
    baseURL + zipeCode + countryCode + apiKey + units
  );
  try {
    const data = await request.json();
    // If status code (request) is not equal 200, then there is an error
    if (data.cod !== 200) {
      error.textContent = data.message;
    }
    return data;
  } catch (error) {
    console.log('Error', error);
  }
};

/* Function to POST data */
const postData = async (url, data) => {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // Body data type must match 'Content-Type' header
  });
  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log('error', error);
  }
};


/**
 * Function to GET Data from Server
 * Update user interface
 */
const UI = async () => {
  const request = await fetch('/all');
  try {
    const data = await request.json();
    // Get wether today from Project Data then append it in landing page
    document.querySelector('#temp').textContent = data.temp + '°';
    document.getElementById(
      'temp-min-max'
    ).textContent = `${data.tempMin}° / ${data.tempMax}°`;
    document.querySelector('#feel-like').textContent = data.feelsLike + '°';
    document.querySelector('#pressure').textContent = data.pressure;
    document.querySelector('#humidity').textContent = data.humidity;
    document.querySelector('#visibility').textContent = data.visibility;
    document.querySelector('#wind').textContent = data.wind + ' km/h';
    document.querySelector('#clouds').textContent = data.clouds;
    document.querySelector('#wdes').textContent = data.wDes;
    document
      .querySelector('#icon')
      .setAttribute(
        'src',
        `https://openweathermap.org/img/wn/${data.icon}@2x.png`
      );
    document.querySelector(
      '.city'
    ).innerHTML = `${data.city} <span>/ ${data.country}</span>`;
    document.querySelector('.date').textContent = data.date;
    document.querySelector('#content').textContent = data.userResponse;
  } catch (error) {
    console.log('error', error);
  }
};
