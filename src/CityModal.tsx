import { useEffect, useRef } from "react";
import type { CityModalProps } from "./global/types";

export function CityModal({
	name,
	country,
	onClose,
}: CityModalProps) {
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
			onCancel={(event) => {
				event.preventDefault();
				onClose();
			}}
		>
			<article className="p-6">
				<header className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
					<div>
						<p className="text-sm font-semibold text-brand-600">
							Detalhes da cidade
						</p>
						<h2 id="city-modal-title" className="mt-1 text-2xl font-bold">
							{name}
						</h2>
						<p className="mt-1 text-sm text-slate-500">{country}</p>
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

				<section className="py-6">
					<p className="text-sm text-slate-500">
						As informações meteorológicas serão exibidas aqui.
					</p>
				</section>
			</article>
		</dialog>
	);
}
