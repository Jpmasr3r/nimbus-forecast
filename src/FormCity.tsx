import { useEffect, useState } from "react";
import { CityModal } from "./CityModal";
import { CityResults } from "./CityResult";
import { getFavorites, toggleFavorite } from "./global/function";
import type { ApiResponseType, CityType } from "./global/types";

const BASE_API = "https://geocoding-api.open-meteo.com/v1";

export function FormCity() {
	const [city, setCity] = useState("");
	const [results, setResults] = useState<CityType[]>([]);
	const [favorites, setFavorites] = useState<CityType[]>(getFavorites);
	const hasSearch = city.trim().length > 0;
	const displayedCities = hasSearch ? results : favorites;
	const [selectCity, setSelectCity] = useState<CityType | null>(null);

	useEffect(() => {
		localStorage.setItem("favoriteCities", JSON.stringify(favorites));
	}, [favorites]);

	function handleToggleFavorite(selectedCity: CityType): void {
		setFavorites((currentFavorites) => {
			return toggleFavorite(currentFavorites, selectedCity);
		});
	}

	useEffect(() => {
		const controller = new AbortController();

		async function request(cityName: string): Promise<void> {
			const name = cityName.trim();

			if (!name) {
				setResults([]);
				return;
			}

			try {
				const params = new URLSearchParams({
					name,
					count: "10",
					language: "pt",
					format: "json",
				});

				const response = await fetch(`${BASE_API}/search?${params}`, {
					signal: controller.signal,
				});

				if (!response.ok) {
					throw new Error(`Erro HTTP : ${response.status}`);
				}

				const data: ApiResponseType = await response.json();
				setResults(data.results ?? []);
			} catch (error) {
				if (
					typeof error === "object" &&
					error !== null &&
					"name" in error &&
					error.name === "AbortError"
				) {
					return;
				}

				console.error("Erro ao buscar cidade:", error);
				setResults([]);
			}
		}

		const timer = setTimeout(() => {
			request(city);
		}, 500);

		return () => {
			clearTimeout(timer);
			controller.abort();
		};
	}, [city]);

	return (
		<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
			<div className="border-b border-slate-100 p-5 sm:p-8">
				<label
					className="mb-2 block text-sm font-semibold text-slate-700"
					htmlFor="city"
				>
					Qual cidade você deseja consultar?
				</label>
				<input
					id="city"
					className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
					type="text"
					placeholder="Ex.: Charqueadas"
					value={city}
					onChange={(event) => setCity(event.target.value)}
				/>
				<p className="mt-3 text-sm leading-6 text-slate-500">
					Digite o nome e escolha uma localidade nos resultados.
				</p>
			</div>
			<CityResults
				results={displayedCities}
				favorites={favorites}
				title={hasSearch ? "Cidades encontradas" : "Cidades favoritas"}
				emptyMessage={
					hasSearch
						? "Nenhuma cidade encontrada."
						: "Você ainda não possui cidades favoritas."
				}
				onToggleFavorite={handleToggleFavorite}
				onSelect={(select) => {
					setSelectCity(select);
				}}
			/>
			{selectCity && (
				<CityModal {...selectCity} onClose={() => setSelectCity(null)} />
			)}
		</section>
	);
}
