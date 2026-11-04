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
		<article className="group flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-brand-500 hover:bg-brand-50 hover:shadow-md">
			<button
				type="button"
				className="flex min-w-0 flex-1 items-center justify-between gap-4 text-left"
				onClick={() => onSelect(selectedCity)}
			>
				<div className="min-w-0">
					<h3 className="truncate text-base font-bold text-slate-800">
						{name}
					</h3>
					<p className="mt-1 text-sm text-slate-500">
						{admin1 ? `${admin1}, ${country}` : country}
					</p>
				</div>
				<span
					className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-lg text-brand-600 shadow-sm transition group-hover:bg-brand-600 group-hover:text-white"
					aria-hidden="true"
				>
					→
				</span>
			</button>
			<button
				type="button"
				onClick={() => onToggleFavorite(selectedCity)}
			>
				{favorite ? "Remover favorito" : "Favoritar"}
			</button>
		</article>
	);
}
