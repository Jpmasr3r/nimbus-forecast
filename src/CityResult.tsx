import { City } from "./City";
import type { CityResultsProps } from "./global/types";

export function CityResults({
	results,
	favorites,
	title,
	emptyMessage,
	onToggleFavorite,
	onSelect,
}: CityResultsProps) {
	if (results.length === 0) {
		return (
			<div className="y2k-empty" aria-live="polite">
				<span aria-hidden="true">[ ! ]</span>
				<p>{emptyMessage}</p>
			</div>
		);
	}

	return (
		<section className="y2k-results" aria-live="polite">
			<div className="y2k-section-heading">
				<h2>{title}</h2>
				<span className="y2k-counter">
					{results.length}
				</span>
			</div>
			<div className="grid gap-3 sm:grid-cols-2">
				{results.map((city) => (
					<City
						key={city.id}
						id={city.id}
						name={city.name}
						country={city.country}
						latitude={city.latitude}
						longitude={city.longitude}
						admin1={city.admin1}
						favorite={favorites.some((favorite) => favorite.id === city.id)}
						onToggleFavorite={onToggleFavorite}
						onSelect={onSelect}
					/>
				))}
			</div>
		</section>
	);
}
