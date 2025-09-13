// src/modules/weather/Weather.tsx
import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { Card, Searchbar, Text, ActivityIndicator } from "react-native-paper";
import * as Location from "expo-location";
import { styles } from "./Weather.styles";

type ForecastDay = { date: string; tempMax: number; tempMin: number };

export function WeatherScreen() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState<{ temperature: number; windspeed: number } | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        const loc = await Location.getCurrentPositionAsync({});
        await fetchWeather(loc.coords.latitude, loc.coords.longitude);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  async function fetchWeather(lat: number, lon: number) {
    setLoading(true);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();
      setCurrent(data.current_weather);
      const days: ForecastDay[] = (data.daily?.time || []).map((t: string, i: number) => ({
        date: t,
        tempMax: data.daily.temperature_2m_max[i],
        tempMin: data.daily.temperature_2m_min[i],
      }));
      setForecast(days);
    } catch {
      // ignore network errors for now
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    const q = query.trim();
    if (!q) return;
    try {
      const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1`);
      const gj = await geo.json();
      if (gj.results?.length) {
        const { latitude, longitude } = gj.results[0];
        await fetchWeather(latitude, longitude);
      }
    } catch {
      /* ignore */
    }
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Ort suchen"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSubmit}
        style={styles.search}
      />
      {loading && <ActivityIndicator style={styles.loading} />}
      {current && (
        <Card style={styles.currentCard}>
          <Card.Title title="Aktuelles Wetter" />
          <Card.Content>
            <Text>{`Temperatur: ${current.temperature}°C`}</Text>
            <Text>{`Wind: ${current.windspeed} km/h`}</Text>
          </Card.Content>
        </Card>
      )}
      <FlatList
        data={forecast}
        keyExtractor={d => d.date}
        renderItem={({ item }) => (
          <Card style={styles.dayCard}>
            <Card.Title title={new Date(item.date).toLocaleDateString()} />
            <Card.Content>
              <Text>{`Max: ${item.tempMax}°C  Min: ${item.tempMin}°C`}</Text>
            </Card.Content>
          </Card>
        )}
      />
      <View style={styles.radarContainer}>
        <Text>Regenradar noch nicht implementiert</Text>
      </View>
    </View>
  );
}
