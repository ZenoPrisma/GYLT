// src/modules/registry.ts
import type { ComponentType } from "react";
import { NotesScreen } from ".//notes/Notes";
import { WeatherScreen } from ".//weather/Weather";

export type ModuleId = "weather" | "notes";

export type AppModule = {
  id: ModuleId;
  title: string;
  tabIcon?: string; // optional: später für Icons
  component: ComponentType<any>;
  enabled: boolean;
};

export const MODULES: AppModule[] = [
  { id: "weather", title: "Wetter", component: WeatherScreen, enabled: true },
  { id: "notes",   title: "Notizen", component: NotesScreen,   enabled: true },
];

// Praktischer Helper: Nur aktivierte Module liefern
export const getEnabledModules = () => MODULES.filter(m => m.enabled);
