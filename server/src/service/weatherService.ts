import dotenv from 'dotenv';
dotenv.config();

// Interface for item in fetchWeatherData method.
interface WeatherItem {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    icon: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
  dt_txt: string;
}

// TODO: Define an interface for the Coordinates object

interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object

class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor (
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number,
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  baseURL: string = process.env.BASE_URL as string;
  APIkey: string = process.env.API_KEY as string;
  cityName: string = "";

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const geocodeURL = `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.APIkey}`;

    try {
      const response = await fetch(geocodeURL);

      if (!response.ok) {
        throw new Error(`Failed to fetch location data for ${query}`);
      }

      const data = await response.json();

      if (data.length === 0) {
        throw new Error(`No location data found for ${query}.`);
      }

      const { lat, lon } = data[0];

      return { lat, lon };
    } catch (error) {
      console.error("Error fetching location data:", error);
      throw error;      
    }
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates, city: string): Promise<Weather[]> {
    const weatherURL = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.APIkey}`;

    try {
      const response = await fetch(weatherURL);

      if (!response.ok) {
        throw new Error(`Failed to fetch weather data with coordinates: (${coordinates.lat}, ${coordinates.lon}).`)
      }

      const data = await response.json();

      if (data.list.length === 0) {
        throw new Error(`No weather data found with coordinates: (${coordinates.lat}, ${coordinates.lon}).`)
      }

      const weatherData: Weather[] = data.list.map((item: WeatherItem) => {
        const tempK = item.main.temp; // Temp is in Kelvin from API
        const tempF = (tempK - 273.15) * 9/5 + 32;

        return new Weather(
          city,
          item.dt_txt,
          item.weather[0].icon,
          item.weather[0].description,
          tempF,
          item.wind.speed,
          item.main.humidity
        );
      });
  
      return this.buildForecastArray(weatherData);

    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: Weather[]): Weather[] {
    return weatherData.map(weather => {
      return new Weather(
        weather.city,
        weather.date,
        weather.icon,
        weather.iconDescription,
        weather.tempF,
        weather.windSpeed,
        weather.humidity,
      );
    });
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<{ city: string; forecast: Weather[] }> {
    const coordinates = await this.fetchLocationData(city);
    const forecast = await this.fetchWeatherData(coordinates, city);
    return { city, forecast };
  }
}

export default new WeatherService();
