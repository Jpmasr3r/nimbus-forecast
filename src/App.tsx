import { FormCity } from "./FormCity";
import { ThemeToggle } from "./ThemeToggle";

export function App() {
	return (
		<div className="y2k-app">
			<header className="y2k-hero">
				<div className="y2k-topbar">
					<div className="y2k-brand">
						<span aria-hidden="true">☀</span>
						<strong>Consulta meteorológica</strong>
					</div>
					<ThemeToggle />
				</div>

				<div className="y2k-hero-content">
					<p className="y2k-eyebrow">Previsão do tempo</p>
					<h1 className="y2k-logo">Como está o tempo?</h1>
					<p className="y2k-hero-copy">
						Pesquise qualquer cidade e veja as condições atuais e os próximos
						cinco dias.
					</p>
				</div>
				<span className="y2k-system-status" aria-hidden="true">
					SISTEMA METEOROLÓGICO // ONLINE
				</span>
			</header>

			<main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
				<FormCity />
			</main>

			<footer className="y2k-footer">
				Dados fornecidos por{" "}
				<a
					href="https://open-meteo.com/"
					target="_blank"
					rel="noreferrer"
				>
					Open-Meteo
				</a>
				.
			</footer>
		</div>
	);
}
