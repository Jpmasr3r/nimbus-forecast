import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "../src/ThemeToggle";

describe("ThemeToggle", () => {
	it("alterna entre os temas claro e escuro e salva a preferência", () => {
		localStorage.setItem("theme", "light");
		render(<ThemeToggle />);

		fireEvent.click(screen.getByRole("button", { name: "Ativar tema escuro" }));

		expect(document.documentElement.dataset.theme).toBe("dark");
		expect(localStorage.getItem("theme")).toBe("dark");
		expect(
			screen.getByRole("button", { name: "Ativar tema claro" }),
		).toBeInTheDocument();
	});

	it("inicia com a preferência escura salva anteriormente", () => {
		localStorage.setItem("theme", "dark");
		render(<ThemeToggle />);

		expect(document.documentElement.dataset.theme).toBe("dark");
		expect(
			screen.getByRole("button", { name: "Ativar tema claro" }),
		).toHaveAttribute("aria-pressed", "true");
	});

	it("usa a preferência do sistema quando não existe tema salvo", () => {
		vi.spyOn(window, "matchMedia").mockReturnValue({
			matches: true,
			media: "(prefers-color-scheme: dark)",
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		});

		render(<ThemeToggle />);

		expect(document.documentElement.dataset.theme).toBe("dark");
		expect(localStorage.getItem("theme")).toBe("dark");
	});
});
