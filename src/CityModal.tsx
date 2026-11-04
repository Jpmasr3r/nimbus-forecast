import { useEffect, useRef, useState } from "react";
import type { CityModalProps, WeatherApiResponseType } from "./global/types";
import { getWeather, getWeatherDescription } from "./global/weather";
import { Loading } from "./Loading";
import { Notification } from "./Notification";

function formatWeatherValue(
	value: number | null | undefined,
	unit: string | undefined,
): string {
	return value == null ? "Não disponível" : `${value}${unit ?? ""}`;
}

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
			setWeather(null);

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
			className="city-modal y2k-modal"
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
			<article className="y2k-modal-card">
				<header className="y2k-modal-header">
					<div>
						<p className="y2k-eyebrow">
							Previsão do tempo
						</p>
						<h2 id="city-modal-title" className="y2k-modal-title">
							{name}
						</h2>
						<p className="y2k-muted">
							{admin1 ? `${admin1}, ${country}` : country}
						</p>
					</div>

					<button
						type="button"
						className="y2k-close"
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
						className="y2k-error-panel"
						role="alert"
					>
						{error}
					</p>
				)}

				{weather && (
					<>
						<section className="y2k-weather-section" aria-labelledby="current-weather-title">
							<div className="mb-4 flex items-center justify-between gap-4">
								<h3
									id="current-weather-title"
									className="y2k-section-title"
								>
									Condições atuais
								</h3>
								<span className="y2k-condition-badge">
									{getWeatherDescription(weather.current.weather_code)}
								</span>
							</div>

							<dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
								<div className="y2k-stat">
									<dt>
										Temperatura
									</dt>
									<dd>
										{weather.current.temperature_2m}
										{weather.current_units.temperature_2m}
									</dd>
								</div>
								<div className="y2k-stat">
									<dt>
										Sensação térmica
									</dt>
									<dd>
										{formatWeatherValue(
											weather.current.apparent_temperature,
											weather.current_units.apparent_temperature,
										)}
									</dd>
								</div>
								<div className="y2k-stat">
									<dt>
										Umidade
									</dt>
									<dd>
										{formatWeatherValue(
											weather.current.relative_humidity_2m,
											weather.current_units.relative_humidity_2m,
										)}
									</dd>
								</div>
								<div className="y2k-stat">
									<dt>Vento</dt>
									<dd>
										{weather.current.wind_speed_10m}
										{weather.current_units.wind_speed_10m}
									</dd>
								</div>
							</dl>
						</section>

						<section
							className="y2k-weather-section y2k-forecast-section"
							aria-labelledby="daily-forecast-title"
						>
							<h3
								id="daily-forecast-title"
								className="y2k-section-title"
							>
								Previsão para cinco dias
							</h3>
							<div className="mt-4 grid gap-3 sm:grid-cols-2">
								{weather.daily.time.map((date, index) => (
									<article className="y2k-forecast-card" key={date}>
										<h4>{date}</h4>
										<p className="y2k-muted">
											{getWeatherDescription(weather.daily.weather_code[index])}
										</p>
										<dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
											<div>
												<dt>Mín.</dt>
												<dd className="font-semibold">
													{weather.daily.temperature_2m_min[index]}
													{weather.daily_units.temperature_2m_min}
												</dd>
											</div>
											<div>
												<dt>Máx.</dt>
												<dd className="font-semibold">
													{weather.daily.temperature_2m_max[index]}
													{weather.daily_units.temperature_2m_max}
												</dd>
											</div>
											<div>
												<dt>Chuva</dt>
												<dd className="font-semibold">
													{formatWeatherValue(
														weather.daily.precipitation_probability_max?.[index],
														weather.daily_units.precipitation_probability_max,
													)}
												</dd>
											</div>
										</dl>
									</article>
								))}
							</div>
						</section>
					</>
				)}

				<footer className="y2k-modal-footer">
					<span className="y2k-status-dot" /> Dados atualizados por Open-Meteo
				</footer>
			</article>
		</dialog>
	);
}
