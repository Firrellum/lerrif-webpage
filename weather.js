const weather = document.getElementById("weather_info") || console.warn("no wearther element!");

async function getWeatherData() {
    try {
        const response = await fetch('https://api.weatherapi.com/v1/forecast.json?key=9d52832445de4d18b0c152812240202&q=auto:ip&days=1');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        console.log('Weather data:', data);
        
        const currentTemp = data.current.temp_c;
        const location = data.location.name;
        const condition = data.current.condition.text;
        
        weather.innerHTML = `${location} : ${condition}  <img style="width:50px; height:50px;"  src="${data.current.condition.icon}"/>  ${currentTemp}°C `
        return data; 

        
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

getWeatherData();