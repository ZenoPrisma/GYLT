// src/modules/weather/Weather.tsx
import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { Card, Searchbar, Text, ActivityIndicator } from "react-native-paper";
import * as Location from "expo-location";
import { styles } from "./Weather.styles";

type ForecastDay = { date: string; tempMax: number; tempMin: number };
type CurrentWeather = {
  temperature: number;
  windspeed: number;
  precipitationProb: number | null;
  tempMax: number;
  tempMin: number;
};

export function WeatherScreen() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [myWeather, setMyWeather] = useState<CurrentWeather | null>(null);
  const [searchWeather, setSearchWeather] = useState<{
    location: string;
    weather: CurrentWeather;
  } | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [myLocationName, setMyLocationName] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        const loc = await Location.getCurrentPositionAsync({});
        const [addr] = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        if (addr)
          setMyLocationName([addr.city, addr.country].filter(Boolean).join(", "));
        const weather = await fetchWeather(
          loc.coords.latitude,
          loc.coords.longitude,
        );
        if (weather) {
          setMyWeather(weather.current);
          setForecast(weather.forecast);
        }
      } catch {
        /* ignore */
      }
    })();
  }, []);

  async function fetchWeather(lat: number, lon: number) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=precipitation_probability&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();
      const idx = data.hourly.time.indexOf(data.current_weather.time);
      const precipitationProb =
        idx >= 0 ? data.hourly.precipitation_probability[idx] : null;
      const current: CurrentWeather = {
        temperature: data.current_weather.temperature,
        windspeed: data.current_weather.windspeed,
        precipitationProb,
        tempMax: data.daily.temperature_2m_max[0],
        tempMin: data.daily.temperature_2m_min[0],
      };
      const days: ForecastDay[] = (data.daily?.time || []).map(
        (t: string, i: number) => ({
          date: t,
          tempMax: data.daily.temperature_2m_max[i],
          tempMin: data.daily.temperature_2m_min[i],
        }),
      );
      return { current, forecast: days };
    } catch {
      return null;
    }
  }

  async function handleSubmit() {
    const q = query.trim();
    if (!q) return;
    try {
      setLoading(true);
      const geo = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1`,
      );
      const gj = await geo.json();
      if (gj.results?.length) {
        const { latitude, longitude, name, country } = gj.results[0];
        const weather = await fetchWeather(latitude, longitude);
        if (weather)
          setSearchWeather({
            location: [name, country].filter(Boolean).join(", "),
            weather: weather.current,
          });
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {myWeather ? (
        <Card style={styles.currentCard}>
          <Card.Title title={`Aktuell: ${myLocationName ?? ""}`} />
          <Card.Content>
            <Text>{`Temperatur: ${myWeather.temperature}°C`}</Text>
            <Text>{`Wind: ${myWeather.windspeed} km/h`}</Text>
            {myWeather.precipitationProb != null && (
              <Text>{`Regenwahrscheinlichkeit: ${myWeather.precipitationProb}%`}</Text>
            )}
          </Card.Content>
        </Card>
      ) : (
        <ActivityIndicator style={styles.loading} />
      )}
      <Searchbar
        placeholder="Ort suchen"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSubmit}
        style={styles.search}
      />
      {loading && <ActivityIndicator style={styles.loading} />}
      {searchWeather && (
        <Card style={styles.currentCard}>
          <Card.Title title={`Aktuell in ${searchWeather.location}`} />
          <Card.Content>
            <Text>{`Temperatur: ${searchWeather.weather.temperature}°C`}</Text>
            <Text>{`Wind: ${searchWeather.weather.windspeed} km/h`}</Text>
            {searchWeather.weather.precipitationProb != null && (
              <Text>{`Regenwahrscheinlichkeit: ${searchWeather.weather.precipitationProb}%`}</Text>
            )}
            <Text>{`Höchst: ${searchWeather.weather.tempMax}°C  Tiefst: ${searchWeather.weather.tempMin}°C`}</Text>
          </Card.Content>
        </Card>
      )}
      <FlatList
        data={forecast}
        keyExtractor={d => d.date}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card style={styles.dayCard}>
            <Card.Title
              title={new Date(item.date).toLocaleDateString(undefined, {
                month: "numeric",
                day: "numeric",
              })}
            />
            <Card.Content>
              <Text>{`Max: ${item.tempMax}°C  Min: ${item.tempMin}°C`}</Text>
            </Card.Content>
          </Card>
        )}
        contentContainerStyle={styles.forecastList}
      />
    </View>
  );
}
