import { CitySchema, StoredFavoritesSchema } from "./schemas";
import type { CityType } from "./types";

export function isSameCity(first: CityType, second: CityType): boolean {
	return (
		first.id === second.id &&
		first.latitude === second.latitude &&
		first.longitude === second.longitude
	);
}

export function getFavorites(): CityType[] {
	try {
		const storedValue: unknown = JSON.parse(
			localStorage.getItem("favoriteCities") ?? "[]",
		);
		const storedFavorites = StoredFavoritesSchema.safeParse(storedValue);

		if (!storedFavorites.success) {
			return [];
		}

		return storedFavorites.data.flatMap((city) => {
			const result = CitySchema.safeParse(city);
			return result.success ? [result.data] : [];
		});
	} catch {
		return [];
	}
}

export function toggleFavorite(
	favorites: CityType[],
	selectedCity: CityType,
): CityType[] {
	const alreadyFavorite = favorites.some(
		(favorite) => isSameCity(favorite, selectedCity),
	);

	return alreadyFavorite
		? favorites.filter((favorite) => !isSameCity(favorite, selectedCity))
		: [...favorites, selectedCity];
}
