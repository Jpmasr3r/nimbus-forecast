import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FormCity } from "../src/FormCity";

const portoAlegre = {
	id: 1,
	name: "Porto Alegre",
	country: "Brasil",
	admin1: "Rio Grande do Sul",
	latitude: -30.03,
	longitude: -51.23,
};

function cityResponse(results: unknown[]): Response {
	return {
		ok: true,
		json: vi.fn().mockResolvedValue({
			results: results.map((city) => ({
				elevation: 0,
				feature_code: "PPL",
				country_code: "BR",
				timezone: "America/Sao_Paulo",
				...(city as object),
			})),
			generationtime_ms: 0.1,
		}),
	} as unknown as Response;
}

function weatherResponse(): Response {
	return {
		ok: true,
		json: vi.fn().mockResolvedValue({
			latitude: -30.03,
			longitude: -51.23,
			generationtime_ms: 0.1,
			utc_offset_seconds: -10800,
			timezone: "America/Sao_Paulo",
			timezone_abbreviation: "GMT-3",
			elevation: 10,
			current_units: {
				time: "iso8601",
				interval: "seconds",
				temperature_2m: "°C",
				relative_humidity_2m: "%",
				apparent_temperature: "°C",
				weather_code: "wmo code",
				wind_speed_10m: "km/h",
			},
			current: {
				time: "2026-11-04T10:00",
				interval: 900,
				temperature_2m: 21,
				relative_humidity_2m: 70,
				apparent_temperature: 22,
				weather_code: 0,
				wind_speed_10m: 8,
			},
			daily_units: {
				time: "iso8601",
				weather_code: "wmo code",
				temperature_2m_max: "°C",
				temperature_2m_min: "°C",
				precipitation_probability_max: "%",
			},
			daily: {
				time: [
					"2026-11-04",
					"2026-11-05",
					"2026-11-06",
					"2026-11-07",
					"2026-11-08",
				],
				weather_code: [0, 1, 2, 3, 61],
				temperature_2m_max: [25, 26, 24, 23, 22],
				temperature_2m_min: [15, 16, 14, 13, 12],
				precipitation_probability_max: [10, 15, 20, 30, 70],
			},
		}),
	} as unknown as Response;
}

function submitSearch(value: string): void {
	fireEvent.change(screen.getByRole("textbox"), { target: { value } });
	fireEvent.click(screen.getByRole("button", { name: "Pesquisar" }));
}

async function finishPromises(): Promise<void> {
	await act(async () => {
		await Promise.resolve();
		await Promise.resolve();
	});
}

describe("simulações de usuários", () => {
	it("usuário perfeito: conclui pesquisa, previsão e favoritos sem erros", async () => {
		const fetchMock = vi.fn((url: string | URL | Request) =>
			String(url).includes("geocoding-api")
				? Promise.resolve(cityResponse([portoAlegre]))
				: Promise.resolve(weatherResponse()),
		);
		vi.stubGlobal("fetch", fetchMock);
		render(<FormCity />);
		const input = screen.getByRole("textbox");

		submitSearch("Porto Alegre");
		await screen.findByText("Porto Alegre");

		expect(screen.getByText("Porto Alegre")).toBeInTheDocument();
		expect(screen.getByText("Rio Grande do Sul, Brasil")).toBeInTheDocument();
		expect(
			screen.getByText("Pesquisa concluída com sucesso. 1 cidade encontrada."),
		).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: /Porto Alegre/i }));
		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(
			screen.getByText("Carregando informações meteorológicas..."),
		).toBeInTheDocument();
		await finishPromises();

		expect(screen.getByText("21°C")).toBeInTheDocument();
		expect(screen.getAllByText("Céu limpo").length).toBeGreaterThan(0);
		expect(screen.getAllByText(/^2026-11-/)).toHaveLength(5);

		fireEvent.click(
			screen.getByRole("button", { name: "Fechar detalhes da cidade" }),
		);
		fireEvent.click(screen.getByRole("button", { name: "Favoritar" }));
		fireEvent.change(input, { target: { value: "" } });
		fireEvent.click(screen.getByRole("button", { name: "Pesquisar" }));

		expect(
			screen.getByRole("heading", { name: "Cidades favoritas" }),
		).toBeInTheDocument();
		expect(JSON.parse(localStorage.getItem("favoriteCities") ?? "[]")).toEqual([
			portoAlegre,
		]);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it("usuário leigo: recebe orientação ao pesquisar espaços e cidade inexistente", async () => {
		const fetchMock = vi.fn().mockResolvedValue(cityResponse([]));
		vi.stubGlobal("fetch", fetchMock);
		render(<FormCity />);

		expect(
			screen.getByText(
				"A pesquisa acontece automaticamente ou ao pressionar Pesquisar.",
			),
		).toBeInTheDocument();
		submitSearch("   ");
		expect(fetchMock).not.toHaveBeenCalled();
		expect(
			screen.getByText("Informe o nome de uma cidade para pesquisar."),
		).toBeInTheDocument();

		submitSearch("Cidade que não existe");
		await screen.findByText("Nenhuma cidade encontrada.");

		expect(fetchMock).toHaveBeenCalledOnce();
		expect(
			screen.getByText("Pesquisa concluída, mas nenhuma cidade foi encontrada."),
		).toBeInTheDocument();
		expect(screen.getByText("Nenhuma cidade encontrada.")).toBeInTheDocument();
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("usuário falho: não quebra o sistema com dados corrompidos e entrada hostil", async () => {
		localStorage.setItem("favoriteCities", "{dados quebrados");
		const hostileInput = "<script>alert('falha')</script>";
		const fetchMock = vi.fn().mockResolvedValue({
			ok: true,
			json: vi.fn().mockResolvedValue({ results: "estrutura inválida" }),
		});
		const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
		vi.stubGlobal("fetch", fetchMock);
		render(<FormCity />);
		const input = screen.getByRole("textbox");

		fireEvent.change(input, { target: { value: "<script>" } });
		fireEvent.change(input, { target: { value: "<script>alert" } });
		submitSearch(hostileInput);
		await screen.findByText(
			"Não foi possível buscar cidades. Tente novamente em alguns instantes.",
		);

		expect(fetchMock).toHaveBeenCalledOnce();
		const requestedUrl = new URL(String(fetchMock.mock.calls[0][0]));
		expect(requestedUrl.searchParams.get("name")).toBe(hostileInput);
		expect(consoleError).toHaveBeenCalledOnce();
		expect(
			screen.getByText(
				"Não foi possível buscar cidades. Tente novamente em alguns instantes.",
			),
		).toBeInTheDocument();
		expect(screen.queryByText("Buscando cidades...")).not.toBeInTheDocument();
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		expect(document.querySelectorAll("script")).toHaveLength(0);
		expect(localStorage.getItem("favoriteCities")).toBe("[]");
	});
});
