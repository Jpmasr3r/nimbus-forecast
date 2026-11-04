import { CityApiResponseSchema } from "./schemas";
import type { CityApiResponseType } from "./types";

const CITY_API = "https://geocoding-api.open-meteo.com/v1/search";

export async function getCities(
	name: string,
	signal?: AbortSignal,
): Promise<CityApiResponseType> {
	const params = new URLSearchParams({
		name: name.trim(),
		count: "10",
		language: "pt",
		format: "json",
	});

	const response = await fetch(`${CITY_API}?${params}`, { signal });

	if (!response.ok) {
		throw new Error(`Erro HTTP: ${response.status}`);
	}

	const payload: unknown = await response.json();
	const result = CityApiResponseSchema.safeParse(payload);

	if (!result.success) {
		throw new Error("Resposta inválida da API de cidades.");
	}

	return result.data;
}
