import type { CityProps } from "./global/types";

export function City({
	id,
	name,
	country,
	latitude,
	longitude,
	admin1,
	favorite,
	onToggleFavorite,
	onSelect,
}: CityProps) {
	const selectedCity = {
		id,
		name,
		country,
		latitude,
		longitude,
		...(admin1 ? { admin1 } : {}),
	};

	return (
		<article className="y2k-city group">
			<button
				type="button"
				className="y2k-city-main"
				onClick={() => onSelect(selectedCity)}
			>
				<div className="min-w-0">
					<h3 className="truncate text-base font-bold">
						{name}
					</h3>
					<p className="y2k-city-location">
						{admin1 ? `${admin1}, ${country}` : country}
					</p>
				</div>
				<span className="y2k-arrow" aria-hidden="true">
					→
				</span>
			</button>
			<button
				type="button"
				className={`y2k-favorite ${favorite ? "is-active" : ""}`}
				aria-label={favorite ? "Remover favorito" : "Favoritar"}
				onClick={() => onToggleFavorite(selectedCity)}
			>
				<span aria-hidden="true">{favorite ? "★" : "☆"}</span>
			</button>
		</article>
	);
}
