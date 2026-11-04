import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
	const savedTheme = localStorage.getItem("theme");

	if (savedTheme === "light" || savedTheme === "dark") {
		return savedTheme;
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>(getInitialTheme);
	const dark = theme === "dark";

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
		localStorage.setItem("theme", theme);
	}, [theme]);

	return (
		<button
			type="button"
			className="y2k-theme-toggle"
			aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"}
			aria-pressed={dark}
			onClick={() => setTheme(dark ? "light" : "dark")}
		>
			<span aria-hidden="true">{dark ? "☀" : "☾"}</span>
			{dark ? "Tema claro" : "Tema escuro"}
		</button>
	);
}
