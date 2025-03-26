const weather = document.getElementById("weather_info") || console.warn("No weather element!");
const poke = document.getElementById("poke_info") || console.warn("No poke element!");

async function fetchData(url, errorMessage) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(errorMessage, error);
    }
}

async function getWeatherData() {
    const data = await fetchData(
        'https://api.weatherapi.com/v1/forecast.json?key=9d52832445de4d18b0c152812240202&q=auto:ip&days=1',
        'Error fetching weather data:'
    );
    if (data && weather) {
        weather.innerHTML = `${data.location.name}: ${data.current.condition.text} <img style="width:50px; height:50px;" src="${data.current.condition.icon}"/> ${data.current.temp_c}°C`;
    }
    return data;
}

async function getPokeData(id) {
    const data = await fetchData(
        `https://pokeapi.co/api/v2/pokemon/${id}`,
        'Error fetching Pokémon data:'
    );
    if (data && poke) {
        let name = data.name;
        name = name[0].toUpperCase() + + name.slice(1);
        poke.innerHTML = `${name}<a href="https://www.google.com/search?q=${data.name}" target="_blank"><img src="${data.sprites.front_default}"/></a>`;
    }
    return data;
}
const randomId = Math.floor(Math.random() * 1025).toString();
Promise.all([getWeatherData(), getPokeData(randomId)]);

