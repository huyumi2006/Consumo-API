// Select DOM elements
const result = document.querySelector('.result');
const form = document.querySelector('.get-weather');
const nameCity = document.querySelector('#city');
const nameCountry = document.querySelector('#country');

// Add event listener for form submission
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission

    // Clear any existing error messages before validation
    clearError();

    // Validate if both city and country fields are filled
    if (nameCity.value.trim() === '' || nameCountry.value.trim() === '') {
        showError('Ambos campos son obligatorios...');
        return; // Stop execution if validation fails
    }

    // Call the API with the entered city and country
    callAPI(nameCity.value.trim(), nameCountry.value.trim());
});

// Function to call the OpenWeatherMap API
function callAPI(city, country){
    // Your OpenWeatherMap API key
    // NOTE: For production, consider using a backend proxy to hide your API key.
    const apiId = '93e7f7784ab4619e51e5d3218764a411';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiId}&lang=es`; // Added lang=es for Spanish descriptions

    fetch(url)
        .then(data => {
            // Check if the response is successful (status 200-299)
            if (!data.ok) {
                // If not successful, throw an error to be caught by the .catch block
                throw new Error(`HTTP error! status: ${data.status}`);
            }
            return data.json(); // Parse the JSON response
        })
        .then(dataJSON => {
            // Check for specific API error code (e.g., 404 for city not found)
            if (dataJSON.cod === '404') {
                showError('Ciudad no encontrada o país incorrecto.');
            } else {
                clearHTML(); // Clear previous weather data displayed
                showWeather(dataJSON); // Display the fetched weather data
            }
        })
        .catch(error => {
            // Handle network errors or errors from the API response
            showError('Hubo un problema al conectar con el servidor de clima. Intenta de nuevo más tarde.');
            console.error('Error fetching weather data:', error); // Log the error for debugging
        });
}

// Function to display the weather information on the page
function showWeather(data){
    // Destructure relevant data from the API response
    const {name, main:{temp, temp_min, temp_max}, weather:[arr]} = data;

    // Convert temperatures from Kelvin to Centigrade
    const degrees = kelvinToCentigrade(temp);
    const min = kelvinToCentigrade(temp_min);
    const max = kelvinToCentigrade(temp_max);

    // Create a new div element to hold the weather content
    const content = document.createElement('div');
    content.classList.add('flex', 'flex-col', 'items-center', 'space-y-3'); // Add Tailwind classes for styling

    content.innerHTML = `
        <h5 class="text-2xl font-semibold text-gray-800">Clima en ${name}</h5>
        <img src="https://openweathermap.org/img/wn/${arr.icon}@2x.png" alt="${arr.description} icon" class="weather-icon">
        <h2 class="text-5xl font-bold text-blue-600">${degrees}°C</h2>
        <p class="text-xl text-gray-600">Máx: <span class="font-medium">${max}°C</span></p>
        <p class="text-xl text-gray-600">Mín: <span class="font-medium">${min}°C</span></p>
        <p class="text-lg text-gray-500 capitalize">${arr.description}</p>
    `;

    result.appendChild(content); // Append the content to the result div
}

// Function to display an error message
function showError(message){
    // Remove any previously displayed error message
    clearError();

    const alert = document.createElement('p');
    alert.classList.add('alert-message', 'bg-red-100', 'text-red-700', 'p-3', 'rounded-lg', 'mt-4', 'text-sm'); // Tailwind classes for error styling
    alert.innerHTML = message;
    alert.id = 'weather-app-alert'; // Assign an ID for easy removal

    form.appendChild(alert); // Append the alert message below the form

    // Set a timeout to remove the alert message after 3 seconds
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Function to clear any existing error messages from the DOM
function clearError() {
    const existingAlert = document.querySelector('#weather-app-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
}

// Function to convert temperature from Kelvin to Centigrade
function kelvinToCentigrade(temp){
    // Using Math.round to get a whole number for temperature
    return Math.round(temp - 273.15);
}

// Function to clear the weather results HTML
function clearHTML(){
    result.innerHTML = '';
}
