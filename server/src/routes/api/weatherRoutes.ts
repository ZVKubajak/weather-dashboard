import { Router } from "express";
const router = Router();

import HistoryService from "../../service/historyService.js";
import WeatherService from "../../service/weatherService.js";

// * TODO: POST Request with city name to retrieve weather data
router.post("/", async (req, res) => {
  try {
    const city = req.body.cityName;
    console.log(city);

    if (!city) {
      return res.status(400).send("City name is required.");
    }

    // * TODO: GET weather data from city name
    const weatherData = await WeatherService.getWeatherForCity(city);
    console.log("This is a console.log", weatherData);

    // * TODO: save city to search history
    await HistoryService.addCity(city);

    return res.json({
      message: `Successfully fetched weather data for ${city}.`,
      data: weatherData.forecast,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Failed to fetch weather data.");
  }
});

// * TODO: GET search history
router.get("/history", async (_req, res) => {
  try {
    const cities = await HistoryService.getCities();
    return res.json(cities);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Failed to fetch search history.");
  }
});

// * BONUS TODO: DELETE city from search history
// router.delete('/history/:id', async (req, res) => {});

export default router;
