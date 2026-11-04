import { useEffect, useRef, useState } from "react";

export type NotificationVariant = "info" | "success" | "error";

type NotificationProps = {
	message: string;
	variant?: NotificationVariant;
	onClose?: () => void;
};

const VARIANT_STYLES: Record<NotificationVariant, string> = {
	info: "border-brand-100 text-slate-700",
	success: "border-emerald-200 text-emerald-800",
	error: "border-red-200 text-red-700",
};

function getNotificationDuration(message: string): number {
	const wordCount = message.trim().split(/\s+/).filter(Boolean).length;
	const tenWordBlocks = Math.max(1, Math.ceil(wordCount / 10));

	return tenWordBlocks * 5_000;
}

export function Notification({
	message,
	variant = "info",
	onClose,
}: NotificationProps) {
	const [visible, setVisible] = useState(true);
	const onCloseRef = useRef(onClose);

	useEffect(() => {
		onCloseRef.current = onClose;
	}, [onClose]);

	useEffect(() => {
		setVisible(true);

		const timer = window.setTimeout(() => {
			setVisible(false);
			onCloseRef.current?.();
		}, getNotificationDuration(message));

		return () => window.clearTimeout(timer);
	}, [message]);

	if (!visible) {
		return null;
	}

	return (
		<aside
			className={`fixed top-4 right-4 z-50 flex max-w-sm items-start gap-4 rounded-xl border bg-white p-4 shadow-xl ${VARIANT_STYLES[variant]}`}
			role={variant === "error" ? "alert" : "status"}
			aria-live={variant === "error" ? "assertive" : "polite"}
		>
			<p className="text-sm leading-6">{message}</p>
			<button
				type="button"
				className="grid size-7 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
				aria-label="Fechar notificação"
				onClick={() => {
					setVisible(false);
					onCloseRef.current?.();
				}}
			>
				×
			</button>
		</aside>
	);
}
