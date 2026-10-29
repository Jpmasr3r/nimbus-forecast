import { FormCity } from "./FormCity";

export function App() {
	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top,#e0f2fe,#f8fafc_42rem)]">
			<header className="border-b border-white/30 bg-brand-700 px-6 py-12 text-center text-white shadow-sm sm:py-16">
				<p className="mb-3 text-xs font-bold tracking-[0.2em] text-sky-200 uppercase">
					Open-Meteo
				</p>
				<h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
					Consulta Meteorológica
				</h1>
				<p className="mx-auto mt-4 max-w-xl text-base leading-7 text-sky-100 sm:text-lg">
					Encontre uma cidade para consultar suas condições climáticas.
				</p>
			</header>

			<main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
				<FormCity />
			</main>

			<footer className="px-4 pb-8 text-center text-sm text-slate-500">
				Dados de geocodificação fornecidos por{" "}
				<a
					className="font-medium text-brand-600 underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
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
