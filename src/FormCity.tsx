import { useEffect, useRef, useState, type FormEvent } from "react";
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
	const [searchRequest, setSearchRequest] = useState<{
		name: string;
		id: number;
	} | null>(null);
	const [results, setResults] = useState<CityType[]>([]);
	const [favorites, setFavorites] = useState<CityType[]>(getFavorites);
	const [loading, setLoading] = useState(false);
	const [notification, setNotification] = useState<NotificationState | null>(null);
	const notificationId = useRef(0);
	const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		if (debounceTimer.current) {
			clearTimeout(debounceTimer.current);
			debounceTimer.current = null;
		}

		const name = city.trim();

		if (!name) {
			setSearchRequest(null);
			setResults([]);
			notify("Informe o nome de uma cidade para pesquisar.", "error");
			return;
		}

		setSearchRequest((current) => ({
			name,
			id: (current?.id ?? 0) + 1,
		}));
	}

	useEffect(() => {
		const name = city.trim();

		if (!name) {
			return;
		}

		debounceTimer.current = setTimeout(() => {
			setSearchRequest((current) => ({
				name,
				id: (current?.id ?? 0) + 1,
			}));
			debounceTimer.current = null;
		}, 500);

		return () => {
			if (debounceTimer.current) {
				clearTimeout(debounceTimer.current);
				debounceTimer.current = null;
			}
		};
	}, [city]);

	useEffect(() => {
		if (!searchRequest) {
			setLoading(false);
			return;
		}

		const controller = new AbortController();

		async function request(cityName: string): Promise<void> {
			setLoading(true);
			setResults([]);

			try {
				const data = await getCities(cityName, controller.signal);
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

		request(searchRequest.name);

		return () => {
			controller.abort();
		};
	}, [searchRequest]);

	return (
		<section className="y2k-window">
			{notification && (
				<Notification
					key={notification.id}
					message={notification.message}
					variant={notification.variant}
					onClose={() => setNotification(null)}
				/>
			)}
			<form className="y2k-search-area" onSubmit={handleSubmit} noValidate>
				<label
					className="y2k-label"
					htmlFor="city"
				>
					Qual cidade você quer consultar?
				</label>
				<div className="y2k-input-shell">
					<span aria-hidden="true">⌕</span>
					<input
						id="city"
						className="y2k-input"
						type="text"
						placeholder="Ex.: Charqueadas"
						value={city}
						onChange={(event) => {
							setCity(event.target.value);
							setSearchRequest(null);
							setResults([]);
						}}
					/>
					<button className="y2k-search-button" type="submit">
						Pesquisar
					</button>
				</div>
				<p className="y2k-help">
					A pesquisa acontece automaticamente ou ao pressionar Pesquisar.
				</p>
			</form>
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
