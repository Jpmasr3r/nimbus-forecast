import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { City } from "../src/City";

describe("City", () => {
	it("usa um botão comum e envia a cidade ao clicar", () => {
		const onToggleFavorite = vi.fn();

		render(
			<City
				id={42}
				name="Charqueadas"
				country="Brasil"
				latitude={-29.95}
				longitude={-51.62}
				favorite={false}
				onToggleFavorite={onToggleFavorite}
				onSelect={vi.fn()}
			/>,
		);

		const button = screen.getByRole("button", { name: "Favoritar" });
		expect(button).toHaveAttribute("type", "button");

		fireEvent.click(button);

			expect(onToggleFavorite).toHaveBeenCalledWith({
				id: 42,
				name: "Charqueadas",
				country: "Brasil",
				latitude: -29.95,
				longitude: -51.62,
			});
	});

	it("envia todos os dados ao selecionar a cidade", () => {
		const onSelect = vi.fn();

		render(
			<City
				id={42}
				name="Charqueadas"
				country="Brasil"
				latitude={-29.95}
				longitude={-51.62}
				favorite={false}
				onToggleFavorite={vi.fn()}
				onSelect={onSelect}
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: /Charqueadas/i }));

		expect(onSelect).toHaveBeenCalledWith({
			id: 42,
			name: "Charqueadas",
			country: "Brasil",
			latitude: -29.95,
			longitude: -51.62,
		});
	});

	it("indica quando a cidade já é favorita", () => {
		render(
			<City
				id={42}
				name="Charqueadas"
				country="Brasil"
				latitude={-29.95}
				longitude={-51.62}
				favorite
				onToggleFavorite={vi.fn()}
				onSelect={vi.fn()}
			/>,
		);

		expect(
			screen.getByRole("button", { name: "Remover favorito" }),
		).toBeInTheDocument();
	});

	it("exibe a região antes do país quando ela está disponível", () => {
		render(
			<City
				id={42}
				name="Charqueadas"
				country="Brasil"
				admin1="Rio Grande do Sul"
				latitude={-29.95}
				longitude={-51.62}
				favorite={false}
				onToggleFavorite={vi.fn()}
				onSelect={vi.fn()}
			/>,
		);

		expect(screen.getByText("Rio Grande do Sul, Brasil")).toBeInTheDocument();
	});
});
