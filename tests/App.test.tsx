import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../src/App";

describe("App", () => {
	it("exibe a interface principal sem atribuir um nome próprio ao projeto", () => {
		render(<App />);

		expect(
			screen.getByRole("heading", { name: "Como está o tempo?" }),
		).toBeInTheDocument();
		expect(screen.getByText("Consulta meteorológica")).toBeInTheDocument();
		expect(screen.queryByText(/Tempo Pop|WEATHER\.EXE/i)).not.toBeInTheDocument();
	});

	it("mantém a atribuição e o link para a Open-Meteo", () => {
		render(<App />);

		const link = screen.getByRole("link", { name: "Open-Meteo" });
		expect(link).toHaveAttribute("href", "https://open-meteo.com/");
		expect(link).toHaveAttribute("target", "_blank");
	});

	it("associa o campo de pesquisa ao seu rótulo", () => {
		render(<App />);

		expect(
			screen.getByRole("textbox", {
				name: "Qual cidade você quer consultar?",
			}),
		).toBeInTheDocument();
	});
});
