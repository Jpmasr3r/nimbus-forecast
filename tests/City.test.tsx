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
				favorite={false}
				onToggleFavorite={onToggleFavorite}
			/>,
		);

		const button = screen.getByRole("button", { name: "Favoritar" });
		expect(button).toHaveAttribute("type", "button");

		fireEvent.click(button);

		expect(onToggleFavorite).toHaveBeenCalledWith({
			id: 42,
			name: "Charqueadas",
			country: "Brasil",
		});
	});

	it("indica quando a cidade já é favorita", () => {
		render(
			<City
				id={42}
				name="Charqueadas"
				country="Brasil"
				favorite
				onToggleFavorite={vi.fn()}
			/>,
		);

		expect(
			screen.getByRole("button", { name: "Remover favorito" }),
		).toBeInTheDocument();
	});
});
