import { useEffect, useRef, useState } from "react";

export type NotificationVariant = "info" | "success" | "error";

type NotificationProps = {
	message: string;
	variant?: NotificationVariant;
	onClose?: () => void;
};

const VARIANT_STYLES: Record<NotificationVariant, string> = {
	info: "is-info",
	success: "is-success",
	error: "is-error",
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
			className={`y2k-notification ${VARIANT_STYLES[variant]}`}
			role={variant === "error" ? "alert" : "status"}
			aria-live={variant === "error" ? "assertive" : "polite"}
		>
			<span className="y2k-notification-icon" aria-hidden="true">
				{variant === "success" ? "✓" : variant === "error" ? "×" : "i"}
			</span>
			<p>{message}</p>
			<button
				type="button"
				className="y2k-notification-close"
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
