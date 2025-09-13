// src/modules/weather/Weather.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, FlatList } from "react-native";
import { Card, Searchbar, Text, ActivityIndicator, List } from "react-native-paper";
import * as Location from "expo-location";
import { styles } from "./Weather.styles";

type ForecastDay = {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitationProb: number | null;
};
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
  const [searchForecast, setSearchForecast] = useState<ForecastDay[]>([]);
  const [myLocationName, setMyLocationName] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<
    {
      name: string;
      admin1?: string;
      country?: string;
      latitude: number;
      longitude: number;
    }[]
  >([]);

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
          1,
        );
        if (weather) {
          setMyWeather(weather.current);
        }
      } catch {
        /* ignore */
      }
    })();
  }, []);

  async function fetchWeather(lat: number, lon: number, days = 7) {
    try {
      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current_weather=true&hourly=precipitation_probability` +
        `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
        `&forecast_days=${days}&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();
      const currentHour = data.current_weather.time.slice(0, 13) + ":00";
      const idx = data.hourly.time.indexOf(currentHour);
      const precipitationProb =
        idx >= 0 ? data.hourly.precipitation_probability[idx] : null;
      const current: CurrentWeather = {
        temperature: data.current_weather.temperature,
        windspeed: data.current_weather.windspeed,
        precipitationProb,
        tempMax: data.daily.temperature_2m_max[0],
        tempMin: data.daily.temperature_2m_min[0],
      };
      const daysArr: ForecastDay[] =
        days > 1
          ? (data.daily?.time || []).map((t: string, i: number) => ({
              date: t,
              tempMax: data.daily.temperature_2m_max[i],
              tempMin: data.daily.temperature_2m_min[i],
              precipitationProb:
                data.daily.precipitation_probability_max?.[i] ?? null,
            }))
          : [];
      return { current, forecast: daysArr };
    } catch {
      return null;
    }
  }

  function rainEmoji(prob: number | null) {
    if (prob == null) return "";
    if (prob === 0) return "🟢";
    if (prob < 50) return "🟡";
    return "🔴";
  }

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const geo = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=3`,
        );
        const gj = await geo.json();
        if (!cancelled)
          setSuggestions(
            (gj.results?.slice(0, 3) || []).map((r: any) => ({
              name: r.name,
              admin1: r.admin1,
              country: r.country,
              latitude: r.latitude,
              longitude: r.longitude,
            }))
          );
      } catch {
        if (!cancelled) setSuggestions([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [query]);

  async function handleSuggestionSelect(s: {
    name: string;
    admin1?: string;
    country?: string;
    latitude: number;
    longitude: number;
  }) {
    try {
      setLoading(true);
      const weather = await fetchWeather(s.latitude, s.longitude, 7);
      if (weather) {
        setSearchWeather({
          location: [s.name, s.admin1, s.country]
            .filter(Boolean)
            .join(", "),
          weather: weather.current,
        });
        setSearchForecast(weather.forecast);
        setQuery("");
        setSuggestions([]);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
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
        const { latitude, longitude, name, country, admin1 } = gj.results[0];
        const weather = await fetchWeather(latitude, longitude, 7);
        if (weather) {
          setSearchWeather({
            location: [name, admin1, country]
              .filter(Boolean)
              .join(", "),
            weather: weather.current,
          });
          setSearchForecast(weather.forecast);
          setSuggestions([]);
        }
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator
    >
      {myWeather ? (
        <Card style={styles.currentCard}>
          <Card.Title
            title={`Aktuell: ${myLocationName ?? ""} ${rainEmoji(
              myWeather.precipitationProb,
            )}`}
          />
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
      {/** Seven-day forecast for current location removed as requested */}
      <Searchbar
        placeholder="Ort suchen"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSubmit}
        style={styles.search}
      />
      {loading && <ActivityIndicator style={styles.loading} />}
      {suggestions.length > 0 && (
        <Card style={styles.suggestionsCard}>
          {suggestions.map(s => (
            <List.Item
              key={`${s.latitude},${s.longitude}`}
              title={[s.name, s.admin1, s.country]
                .filter(Boolean)
                .join(", ")}
              onPress={() => handleSuggestionSelect(s)}
            />
          ))}
        </Card>
      )}
      {searchWeather && (
        <Card style={styles.currentCard}>
          <Card.Title
            title={`Aktuell in ${searchWeather.location} ${rainEmoji(
              searchWeather.weather.precipitationProb,
            )}`}
          />
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
      {searchForecast.length > 0 && (
        <FlatList
          data={searchForecast}
          keyExtractor={d => d.date}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Card style={styles.dayCard}>
              <Card.Title
                title={
                  new Date(item.date).toLocaleDateString(undefined, {
                    month: "numeric",
                    day: "numeric",
                  }) + ` ${rainEmoji(item.precipitationProb)}`
                }
              />
              <Card.Content>
                <Text>{`Max: ${item.tempMax}°C  Min: ${item.tempMin}°C`}</Text>
              </Card.Content>
            </Card>
          )}
          contentContainerStyle={styles.forecastList}
        />
      )}
    </ScrollView>
  );
}
