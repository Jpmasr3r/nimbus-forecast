import type { CityType } from "./types";

export function getFavorites(): CityType[] {
	try {
		const storedValue: unknown = JSON.parse(
			localStorage.getItem("favoriteCities") ?? "[]",
		);

		if (!Array.isArray(storedValue)) {
			return [];
		}

		return storedValue.filter(
			(city): city is CityType =>
				typeof city === "object" &&
				city !== null &&
				typeof city.id === "number" &&
				typeof city.name === "string" &&
				typeof city.country === "string",
		);
	} catch {
		return [];
	}
}
