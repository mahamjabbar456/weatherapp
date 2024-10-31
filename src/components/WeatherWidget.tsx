'use client';

import { ChangeEvent, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CloudFogIcon, CloudIcon, MapIcon, ThermometerIcon } from "lucide-react";

interface WeatherData {
  temperature : number,
  location : string,
  description : string,
  unit : string
}

const WeatherWidget = () => {
  const [location,setLocation] = useState<string>("");
  const [error,setError] = useState<string | null>(null);
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const [weather,setWeather] = useState<WeatherData | null>(null);
  
  const handleSearch = async (e:ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedLocation = location.trim();
    if(trimmedLocation === ""){
       setError("Please enter a valid location.");
       setWeather(null);
       return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`);
      if(!res.ok){
        throw new Error("City not found");
      }
      const data = await res.json();
      const weatherData : WeatherData = {
        temperature : data.current.temp_c,
        description: data.current.condition.text,
        location: data.location.name,
        unit:"C"
      }
      setWeather(weatherData);
      console.log(weatherData);

    } catch (error) {
      console.error("Error fetching weather data:",error);
      setError("City not found.Please try again.");
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  }

  function getTemperatureMessage(temperature:number,unit:string):string{
    if(unit === "C"){
       if(temperature < 0){
        return `It's freezing at ${temperature}°C! Bundle up!`
       } else if(temperature < 10){
        return `It's quite cold at ${temperature}°C. Wear warm clothes.`;
       }else if(temperature < 20){
        return `The temperature is ${temperature}°C. Comfortable for light jacket.`;
       }else if(temperature < 30){
        return `It's a pleasant ${temperature}°C. Enjoy the nice weather.`;
       }else{
        return `It's hot at ${temperature}°C. Stay hydrated!`;
       }
    }
    else{
      return`${temperature}°${unit}`;
    }
  } 

  function getWeatherDescription(description:string):string{
    switch(description.toLowerCase()) {
      case "sunny":
        return "It's a beautiful sunny day!";
      case "partly cloudy":
        return "Except some clouds and sunshine.";
      case "cloudy":
        return "It's cloudy today.";
      case "overcast":
        return "The sky is overcast.";
      case "rain":
        return "Don't forget your umberlla! It's raining.";
      case "thunderstorm":
        return "Thunderstorms are expected today.";
      case "snow":
        return "Bundle up! It's snowing.";
      case "mist":
        return "It's misty outside.";
      case "fog":
        return "Be careful, there's fog outside.";
      default:
        return description;
    }
  }

  function getLocationMessage(location:string):string{
    const currentHour = new Date().getHours();
    const isDay = currentHour <= 18 && currentHour > 6;
    return `${location} ${isDay ? "Day" : "Night"}`;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-sky-300">
      <Card className=" bg-yellow-400 max-w-md w-full shadow-lg flex flex-col justify-center items-center">
          <CardHeader>
             <CardTitle className="text-center">Weather Widget</CardTitle>
             <CardDescription>Search for the current weather condition in your city.</CardDescription>        
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
            type="text"
            placeholder="Enter your city"
            value={location}
            onChange={(e:ChangeEvent<HTMLInputElement>)=>{
              setLocation(e.target.value);
            }}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Search"}
            </Button>
            </form>
            {error && <div className="text-center mt-2 text-red-500">{error}</div>}
            {weather && 
               <div className="my-2">
                <div className="flex items-center gap-2">
                  <ThermometerIcon className="w-6 h-6" />
                  {getTemperatureMessage(weather.temperature,weather.unit)}
                </div>
                <div className="flex items-center gap-2">
                  <CloudIcon className="w-6 h-6" />
                  {getWeatherDescription(weather.description)}
                </div>
                {/* Display location with message */}
                <div className="flex items-center gap-2">
                  <MapIcon className="w-6 h-6" />
                  <div>{getLocationMessage(weather.location)}</div>
                </div>
               </div>
            }
          </CardContent>
      </Card>
      
    </div>
  )
}

export default WeatherWidget
