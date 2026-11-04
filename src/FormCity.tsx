import { useEffect, useRef, useState } from "react";
import { CityModal } from "./CityModal";
import { CityResults } from "./CityResult";
import { getCities } from "./global/city";
import { getFavorites, toggleFavorite } from "./global/function";
import type { CityType } from "./global/types";
import { Loading } from "./Loading";
import {
	Notification,
	type NotificationVariant,
} from "./Notification";

type NotificationState = {
	id: number;
	message: string;
	variant: NotificationVariant;
};

export function FormCity() {
	const [city, setCity] = useState("");
	const [results, setResults] = useState<CityType[]>([]);
	const [favorites, setFavorites] = useState<CityType[]>(getFavorites);
	const [loading, setLoading] = useState(false);
	const [notification, setNotification] = useState<NotificationState | null>(null);
	const notificationId = useRef(0);
	const hasSearch = city.trim().length > 0;
	const displayedCities = hasSearch ? results : favorites;
	const [selectCity, setSelectCity] = useState<CityType | null>(null);

	function notify(message: string, variant: NotificationVariant): void {
		notificationId.current += 1;
		setNotification({ id: notificationId.current, message, variant });
	}

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
				setLoading(false);
				return;
			}

			setLoading(true);
			setResults([]);

			try {
				const data = await getCities(name, controller.signal);
				const cities = data.results ?? [];
				setResults(cities);

				if (cities.length > 0) {
					notify(
						`Pesquisa concluída com sucesso. ${cities.length} ${cities.length === 1 ? "cidade encontrada" : "cidades encontradas"}.`,
						"success",
					);
				} else {
					notify("Pesquisa concluída, mas nenhuma cidade foi encontrada.", "info");
				}
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
				notify(
					"Não foi possível buscar cidades. Tente novamente em alguns instantes.",
					"error",
				);
			} finally {
				if (!controller.signal.aborted) {
					setLoading(false);
				}
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
			{notification && (
				<Notification
					key={notification.id}
					message={notification.message}
					variant={notification.variant}
					onClose={() => setNotification(null)}
				/>
			)}
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
			{loading ? (
				<Loading message="Buscando cidades..." />
			) : (
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
			)}
			{selectCity && (
				<CityModal {...selectCity} onClose={() => setSelectCity(null)} />
			)}
		</section>
	);
}
