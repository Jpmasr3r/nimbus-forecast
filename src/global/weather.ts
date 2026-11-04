import { WeatherApiResponseSchema } from "./schemas";
import type { WeatherApiResponseType } from "./types";

const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

const WEATHER_DESCRIPTIONS: Record<number, string> = {
	0: "Céu limpo",
	1: "Principalmente limpo",
	2: "Parcialmente nublado",
	3: "Nublado",
	45: "Neblina",
	48: "Neblina com geada",
	51: "Garoa leve",
	53: "Garoa moderada",
	55: "Garoa intensa",
	56: "Garoa congelante leve",
	57: "Garoa congelante intensa",
	61: "Chuva leve",
	63: "Chuva moderada",
	65: "Chuva forte",
	66: "Chuva congelante leve",
	67: "Chuva congelante forte",
	71: "Neve leve",
	73: "Neve moderada",
	75: "Neve forte",
	77: "Grãos de neve",
	80: "Pancadas de chuva leves",
	81: "Pancadas de chuva moderadas",
	82: "Pancadas de chuva fortes",
	85: "Pancadas de neve leves",
	86: "Pancadas de neve fortes",
	95: "Tempestade",
	96: "Tempestade com granizo leve",
	99: "Tempestade com granizo forte",
};

export function getWeatherDescription(code: number): string {
	return WEATHER_DESCRIPTIONS[code] ?? "Condição desconhecida";
}

export async function getWeather(
	latitude: number,
	longitude: number,
	signal?: AbortSignal,
): Promise<WeatherApiResponseType> {
	const params = new URLSearchParams({
		latitude: String(latitude),
		longitude: String(longitude),
		current: [
			"temperature_2m",
			"relative_humidity_2m",
			"apparent_temperature",
			"weather_code",
			"wind_speed_10m",
		].join(","),
		daily: [
			"weather_code",
			"temperature_2m_max",
			"temperature_2m_min",
			"precipitation_probability_max",
		].join(","),
		timezone: "auto",
		forecast_days: "5",
	});

	const response = await fetch(`${WEATHER_API}?${params}`, { signal });

	if (!response.ok) {
		throw new Error(`Erro HTTP: ${response.status}`);
	}

	const payload: unknown = await response.json();
	const result = WeatherApiResponseSchema.safeParse(payload);

	if (!result.success) {
		throw new Error("Resposta inválida da API meteorológica.");
	}

	return result.data;
}
