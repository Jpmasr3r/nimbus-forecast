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
			<p className="p-5 text-sm text-slate-500 sm:p-8" aria-live="polite">
				{emptyMessage}
			</p>
		);
	}

	return (
		<section className="p-5 sm:p-8" aria-live="polite">
			<div className="mb-4 flex items-center justify-between gap-4">
				<h2 className="text-lg font-bold text-slate-800">{title}</h2>
				<span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
					{results.length}
				</span>
			</div>
			<div className="grid gap-3">
				{results.map((city) => (
					<City
						key={city.id}
						id={city.id}
						name={city.name}
						country={city.country}
						latitude={city.latitude}
						longitude={city.longitude}
						favorite={favorites.some((favorite) => favorite.id === city.id)}
						onToggleFavorite={onToggleFavorite}
						onSelect={onSelect}
					/>
				))}
			</div>
		</section>
	);
}
