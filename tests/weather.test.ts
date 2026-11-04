import { afterEach, describe, expect, it, vi } from "vitest";
import { getWeather, getWeatherDescription } from "../src/global/weather";

describe("getWeatherDescription", () => {
	it.each([
		[0, "Céu limpo"],
		[2, "Parcialmente nublado"],
		[45, "Neblina"],
		[55, "Garoa intensa"],
		[63, "Chuva moderada"],
		[67, "Chuva congelante forte"],
		[75, "Neve forte"],
		[77, "Grãos de neve"],
		[82, "Pancadas de chuva fortes"],
		[86, "Pancadas de neve fortes"],
		[95, "Tempestade"],
		[99, "Tempestade com granizo forte"],
	])("converte o código %i para %s", (code, expected) => {
		expect(getWeatherDescription(code)).toBe(expected);
	});

	it("trata códigos desconhecidos sem interromper a aplicação", () => {
		expect(getWeatherDescription(999)).toBe("Condição desconhecida");
	});
});

describe("getWeather", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("rejeita uma resposta meteorológica com estrutura inválida", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: vi.fn().mockResolvedValue({ current: null }),
			}),
		);

		await expect(getWeather(-30.03, -51.23)).rejects.toThrow(
			"Resposta inválida da API meteorológica.",
		);
	});
});
