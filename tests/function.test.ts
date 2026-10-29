import { beforeEach, describe, expect, it } from "vitest";
import { getFavorites, toggleFavorite } from "../src/global/function";

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

	it("rejeita favoritos antigos que não possuem coordenadas", () => {
		localStorage.setItem(
			"favoriteCities",
			JSON.stringify([{ id: 1, name: "Porto Alegre", country: "Brasil" }]),
		);

		expect(getFavorites()).toEqual([]);
	});

	it("rejeita favoritos que possuem apenas uma das coordenadas", () => {
		localStorage.setItem(
			"favoriteCities",
			JSON.stringify([
				{
					id: 1,
					name: "Porto Alegre",
					country: "Brasil",
					latitude: -30.03,
				},
			]),
		);

		expect(getFavorites()).toEqual([]);
	});

	it("mantém apenas cidades com id, nome e país válidos", () => {
		localStorage.setItem(
			"favoriteCities",
			JSON.stringify([
				{
					id: 1,
					name: "Porto Alegre",
					country: "Brasil",
					latitude: -30.03,
					longitude: -51.23,
				},
				{ id: "2", name: "Lisboa", country: "Portugal" },
				{ id: 3, name: "Madrid" },
				null,
			]),
		);

		expect(getFavorites()).toEqual([
			{
				id: 1,
				name: "Porto Alegre",
				country: "Brasil",
				latitude: -30.03,
				longitude: -51.23,
			},
		]);
	});
});

describe("toggleFavorite", () => {
	const city = {
		id: 1,
		name: "Porto Alegre",
		country: "Brasil",
		latitude: -30.03,
		longitude: -51.23,
	};

	it("adiciona uma cidade que ainda não é favorita", () => {
		expect(toggleFavorite([], city)).toEqual([city]);
	});

	it("remove uma cidade que já é favorita", () => {
		expect(toggleFavorite([city], city)).toEqual([]);
	});

	it("não modifica a lista original", () => {
		const favorites = [city];

		toggleFavorite(favorites, city);

		expect(favorites).toEqual([city]);
	});
});
