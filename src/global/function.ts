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
				typeof city.country === "string" &&
				typeof city.latitude === "number" &&
				typeof city.longitude === "number",
		);
	} catch {
		return [];
	}
}

export function toggleFavorite(
	favorites: CityType[],
	selectedCity: CityType,
): CityType[] {
	const alreadyFavorite = favorites.some(
		(favorite) => favorite.id === selectedCity.id,
	);

	return alreadyFavorite
		? favorites.filter((favorite) => favorite.id !== selectedCity.id)
		: [...favorites, selectedCity];
}
