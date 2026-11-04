type LoadingProps = {
	message?: string;
};

export function Loading({ message = "Carregando..." }: LoadingProps) {
	return (
		<div
			className="y2k-loading"
			role="status"
			aria-live="polite"
		>
			<span
				className="y2k-spinner"
				aria-hidden="true"
			/>
			{message}
		</div>
	);
}
