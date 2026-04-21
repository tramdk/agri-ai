export interface WeatherData {
  city: string;
  temp: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export const fetchWeather = async (lat?: number, lon?: number): Promise<WeatherData> => {
  try {
    // We use wttr.in as a reliable free weather service that doesn't require an API key
    // It's perfect for quickly integrating localized weather.
    const query = lat && lon ? `${lat},${lon}` : "Ho+Chi+Minh";
    const response = await fetch(`https://wttr.in/${query}?format=j1`);

    if (!response.ok) throw new Error("Weather service unavailable");

    const data = await response.json();
    const current = data.current_condition[0];
    const city = data.nearest_area[0].areaName[0].value;
    return {
      city: city || (lat ? "Vị trí của bạn" : "Hồ Chí Minh"),
      temp: parseInt(current.temp_C),
      description: current.lang_vi?.[0]?.value || current.weatherDesc[0].value,
      humidity: parseInt(current.humidity),
      windSpeed: parseInt(current.windspeedKmph),
      icon: current.weatherDesc[0].value.toLowerCase(),
    };
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    // Fallback data
    return {
      city: "Hồ Chí Minh",
      temp: 32,
      description: "Có mây",
      humidity: 65,
      windSpeed: 12,
      icon: "cloudy",
    };
  }
};
