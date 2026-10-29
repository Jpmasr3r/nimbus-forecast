import type { CityProps } from "./global/types";

export function City({
	id,
	name,
	country,
	favorite,
	onToggleFavorite,
}: CityProps) {
	return (
		<article className="group flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-brand-500 hover:bg-brand-50 hover:shadow-md">
			<div className="min-w-0">
				<h3 className="truncate text-base font-bold text-slate-800">{name}</h3>
				<p className="mt-1 text-sm text-slate-500">{country}</p>
			</div>
			<span
				className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-lg text-brand-600 shadow-sm transition group-hover:bg-brand-600 group-hover:text-white"
				aria-hidden="true"
			>
				→
			</span>
			<button
				type="button"
				onClick={() => onToggleFavorite({ id, name, country })}
			>
				{favorite ? "Remover favorito" : "Favoritar"}
			</button>
		</article>
	);
}
