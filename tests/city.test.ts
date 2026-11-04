import { afterEach, describe, expect, it, vi } from "vitest";
import { getCities } from "../src/global/city";
import type { CityApiResponseType } from "../src/global/types";

const apiResponse: CityApiResponseType = {
	results: [
		{
			id: 3466261,
			name: "Charqueadas",
			latitude: -29.95472,
			longitude: -51.62528,
			elevation: 22,
			feature_code: "PPL",
			country_code: "BR",
			timezone: "America/Sao_Paulo",
			country: "Brasil",
			admin1: "Rio Grande do Sul",
		},
	],
	generationtime_ms: 0.1,
};

describe("getCities", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("consulta a geocodificação com os parâmetros esperados", async () => {
		const fetchMock = vi.fn().mockResolvedValue({
			ok: true,
			json: vi.fn().mockResolvedValue(apiResponse),
		});
		const controller = new AbortController();
		vi.stubGlobal("fetch", fetchMock);

		const result = await getCities("  Charqueadas  ", controller.signal);

		expect(result).toEqual(apiResponse);
		expect(fetchMock).toHaveBeenCalledOnce();
		const [requestedUrl, options] = fetchMock.mock.calls[0];
		const url = new URL(String(requestedUrl));
		expect(`${url.origin}${url.pathname}`).toBe(
			"https://geocoding-api.open-meteo.com/v1/search",
		);
		expect(url.searchParams.get("name")).toBe("Charqueadas");
		expect(url.searchParams.get("count")).toBe("10");
		expect(url.searchParams.get("language")).toBe("pt");
		expect(url.searchParams.get("format")).toBe("json");
		expect(options).toEqual({ signal: controller.signal });
	});

	it("lança um erro quando a API responde com falha HTTP", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({ ok: false, status: 503 }),
		);

		await expect(getCities("Charqueadas")).rejects.toThrow("Erro HTTP: 503");
	});

	it("rejeita uma resposta com estrutura inválida", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: vi.fn().mockResolvedValue({ results: [{ id: "inválido" }] }),
			}),
		);

		await expect(getCities("Charqueadas")).rejects.toThrow(
			"Resposta inválida da API de cidades.",
		);
	});
});
