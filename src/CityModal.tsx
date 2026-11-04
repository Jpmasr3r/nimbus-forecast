import { useEffect, useRef, useState } from "react";
import type { CityModalProps, WeatherApiResponseType } from "./global/types";
import { getWeather, getWeatherDescription } from "./global/weather";
import { Loading } from "./Loading";
import { Notification } from "./Notification";

export function CityModal({
	name,
	country,
	admin1,
	longitude,
	latitude,
	onClose,
}: CityModalProps) {
	const [weather, setWeather] = useState<WeatherApiResponseType | null>(null);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [notification, setNotification] = useState<{
		message: string;
		variant: "success" | "error";
	} | null>(null);

	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;

		if (dialog && !dialog.open) {
			dialog.showModal();
		}

		return () => {
			if (dialog?.open) {
				dialog.close();
			}
		};
	}, []);

	useEffect(() => {
		const controller = new AbortController();

		async function loadWeather() {
			setLoading(true);
			setError(null);

			try {
				const data = await getWeather(latitude, longitude, controller.signal);
				setWeather(data);
				setNotification({
					message: "Informações meteorológicas carregadas com sucesso.",
					variant: "success",
				});
			} catch (error) {
				if (
					typeof error === "object" &&
					error !== null &&
					"name" in error &&
					error.name === "AbortError"
				) {
					return;
				}

				const message = "Não foi possível consultar o clima.";
				setError(message);
				setNotification({ message, variant: "error" });
			} finally {
				if (!controller.signal.aborted) {
					setLoading(false);
				}
			}
		}

		loadWeather();

		return () => controller.abort();
	}, [latitude, longitude]);

	return (
		<dialog
			ref={dialogRef}
			className="city-modal m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl bg-white p-0 text-slate-800 shadow-2xl"
			aria-labelledby="city-modal-title"
			onClick={(event) => {
				if (event.target === event.currentTarget) {
					onClose();
				}
			}}
			onKeyDown={(event) => {
				if (event.key === "Escape") {
					event.preventDefault();
					onClose();
				}
			}}
			onCancel={(event) => {
				event.preventDefault();
				onClose();
			}}
		>
			{notification && (
				<Notification
					message={notification.message}
					variant={notification.variant}
					onClose={() => setNotification(null)}
				/>
			)}
			<article className="p-6">
				<header className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
					<div>
						<p className="text-sm font-semibold text-brand-600">
							Detalhes da cidade
						</p>
						<h2 id="city-modal-title" className="mt-1 text-2xl font-bold">
							{name}
						</h2>
						<p className="mt-1 text-sm text-slate-500">
							{admin1 ? `${admin1}, ${country}` : country}
						</p>
					</div>

					<button
						type="button"
						className="grid size-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
						aria-label="Fechar detalhes da cidade"
						onClick={onClose}
					>
						×
					</button>
				</header>

				{loading && (
					<Loading message="Carregando informações meteorológicas..." />
				)}

				{error && (
					<p
						className="my-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700"
						role="alert"
					>
						{error}
					</p>
				)}

				{weather && (
					<>
						<section className="py-6" aria-labelledby="current-weather-title">
							<div className="mb-4 flex items-center justify-between gap-4">
								<h3
									id="current-weather-title"
									className="text-lg font-bold text-slate-800"
								>
									Condições atuais
								</h3>
								<span className="text-sm text-slate-500">
									{getWeatherDescription(weather.current.weather_code)}
								</span>
							</div>

							<dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
								<div className="rounded-xl bg-slate-100 p-3">
									<dt className="text-xs font-semibold text-slate-500">
										Temperatura
									</dt>
									<dd className="mt-1 font-bold text-slate-800">
										{weather.current.temperature_2m}
										{weather.current_units.temperature_2m}
									</dd>
								</div>
								<div className="rounded-xl bg-slate-100 p-3">
									<dt className="text-xs font-semibold text-slate-500">
										Sensação térmica
									</dt>
									<dd className="mt-1 font-bold text-slate-800">
										{weather.current.apparent_temperature}
										{weather.current_units.apparent_temperature}
									</dd>
								</div>
								<div className="rounded-xl bg-slate-100 p-3">
									<dt className="text-xs font-semibold text-slate-500">
										Umidade
									</dt>
									<dd className="mt-1 font-bold text-slate-800">
										{weather.current.relative_humidity_2m}
										{weather.current_units.relative_humidity_2m}
									</dd>
								</div>
								<div className="rounded-xl bg-slate-100 p-3">
									<dt className="text-xs font-semibold text-slate-500">Vento</dt>
									<dd className="mt-1 font-bold text-slate-800">
										{weather.current.wind_speed_10m}
										{weather.current_units.wind_speed_10m}
									</dd>
								</div>
							</dl>
						</section>

						<section
							className="border-t border-slate-200 py-6"
							aria-labelledby="daily-forecast-title"
						>
							<h3
								id="daily-forecast-title"
								className="text-lg font-bold text-slate-800"
							>
								Previsão para cinco dias
							</h3>
							<div className="mt-4 grid gap-3 sm:grid-cols-2">
								{weather.daily.time.map((date, index) => (
									<article className="rounded-xl bg-slate-100 p-4" key={date}>
										<h4 className="font-bold text-slate-800">{date}</h4>
										<p className="mt-1 text-sm text-slate-500">
											{getWeatherDescription(weather.daily.weather_code[index])}
										</p>
										<dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
											<div>
												<dt className="text-slate-500">Mín.</dt>
												<dd className="font-semibold">
													{weather.daily.temperature_2m_min[index]}
													{weather.daily_units.temperature_2m_min}
												</dd>
											</div>
											<div>
												<dt className="text-slate-500">Máx.</dt>
												<dd className="font-semibold">
													{weather.daily.temperature_2m_max[index]}
													{weather.daily_units.temperature_2m_max}
												</dd>
											</div>
											<div>
												<dt className="text-slate-500">Chuva</dt>
												<dd className="font-semibold">
													{weather.daily.precipitation_probability_max[index]}
													{weather.daily_units.precipitation_probability_max}
												</dd>
											</div>
										</dl>
									</article>
								))}
							</div>
						</section>
					</>
				)}

				<footer className="border-t border-slate-200 pt-4 text-xs text-slate-500">
					Dados meteorológicos fornecidos por Open-Meteo.
				</footer>
			</article>
		</dialog>
	);
}
