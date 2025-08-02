import React, { useEffect, useState } from 'react';

const API_KEY = "d63d8228e5dc06bc0abc7704ef35e2b2";

const getBackgroundVideo = (main) => {
  switch (main) {
    case "Clear": return "/backgrounds/sunny.mp4";
    case "Rain": return "/backgrounds/rain.mp4.mp4";
    case "Clouds": return "/backgrounds/cloudy.mp4.mp4";
    case "Snow": return "/backgrounds/snow.mp4.mp4";
    default: return "/backgrounds/Default.mp4.mp4";
  }
};

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const fetchWeather = async (query) => {
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&appid=${API_KEY}&units=metric`);
      const data = await res.json();

      if (data.cod === 200) {
        setWeather(data);
        setError("");
      } else {
        setError(data.message);
        setWeather(null);
      }
    } catch (err) {
      setError("Unable to fetch weather data.");
    }
  };

  const getWeatherByCity = () => {
    if (city.trim() !== "") {
      fetchWeather(`q=${city}`);
    }
  };

  const getWeatherByLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(`lat=${latitude}&lon=${longitude}`);
      });
    } else {
      setError("Geolocation not supported");
    }
  };

  useEffect(() => {
    getWeatherByLocation();
  }, []);

  const videoBg = weather ? getBackgroundVideo(weather.weather[0].main) : "/backgrounds/Default.mp4.mp4";

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        src={videoBg}
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      ></video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
      {/* App Content */}
      <div className="relative z-20 flex items-center justify-center h-full">
    <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-xl w-full max-w-sm text-white space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-1">
          🌤️ Weather App
        </h1>
        
      </div>

      {/* Search Bar */}
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-3 py-1 rounded text-black"
        />
        <button
          onClick={getWeatherByCity}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          Search
        </button>
      </div>

      <button
        onClick={getWeatherByLocation}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
      >
        📍 Use Current Location
      </button>

      

      {error && <p className="text-red-200 text-center">{error}</p>}

      {weather && (
        <div className="text-center">
          <h2 className="text-xl font-bold">{weather.name}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
            alt={weather.weather[0].description}
            className="mx-auto w-24 h-24"
          />
          <p className="text-lg font-semibold">{weather.main.temp}°C</p>
          <p className="capitalize">{weather.weather[0].description}</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>🌬️ Wind: {weather.wind.speed} m/s</p>
        </div>
        
      )}
    </div>
  </div>
   {/* Footer */}
      <footer className="absolute bottom-2 w-full text-center z-20 text-white text-sm">
        Made with ❤️ by <span className="font-semibold">Samridh Anuj</span>
      </footer>
</div>
  );
};

export default App;
