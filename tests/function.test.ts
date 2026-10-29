import { beforeEach, describe, expect, it } from "vitest";
import { getFavorites } from "../src/global/function";

describe("getFavorites", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("retorna uma lista vazia quando não há dados salvos", () => {
		expect(getFavorites()).toEqual([]);
	});

	it("trata JSON corrompido sem interromper a aplicação", () => {
		localStorage.setItem("favoriteCities", "{inválido");

		expect(getFavorites()).toEqual([]);
	});

	it("rejeita um valor válido que não seja uma lista", () => {
		localStorage.setItem("favoriteCities", JSON.stringify({ id: 1 }));

		expect(getFavorites()).toEqual([]);
	});

	it("mantém apenas cidades com id, nome e país válidos", () => {
		localStorage.setItem(
			"favoriteCities",
			JSON.stringify([
				{ id: 1, name: "Porto Alegre", country: "Brasil" },
				{ id: "2", name: "Lisboa", country: "Portugal" },
				{ id: 3, name: "Madrid" },
				null,
			]),
		);

		expect(getFavorites()).toEqual([
			{ id: 1, name: "Porto Alegre", country: "Brasil" },
		]);
	});
});
