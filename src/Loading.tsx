type LoadingProps = {
	message?: string;
};

export function Loading({ message = "Carregando..." }: LoadingProps) {
	return (
		<div
			className="flex items-center gap-3 p-5 text-sm font-medium text-slate-600 sm:p-8"
			role="status"
			aria-live="polite"
		>
			<span
				className="size-5 animate-spin rounded-full border-2 border-brand-100 border-t-brand-600"
				aria-hidden="true"
			/>
			{message}
		</div>
	);
}
