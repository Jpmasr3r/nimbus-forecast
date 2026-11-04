import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FormCity } from "../src/FormCity";

const portoAlegre = {
	id: 1,
	name: "Porto Alegre",
	country: "Brasil",
	latitude: -30.03,
	longitude: -51.23,
};

function successfulResponse(results: unknown[]): Response {
	return {
		ok: true,
		json: vi.fn().mockResolvedValue({
			results: results.map((city) => ({
				elevation: 0,
				feature_code: "PPL",
				country_code: "BR",
				timezone: "UTC",
				...(city as object),
			})),
			generationtime_ms: 0.1,
		}),
	} as unknown as Response;
}

async function finishDebounce(): Promise<void> {
	await act(async () => {
		await vi.advanceTimersByTimeAsync(500);
	});
}

describe("simulações de usuários", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	it("usuário experiente: pesquisa, consulta, fecha e favorita uma cidade", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(successfulResponse([portoAlegre])),
		);
		render(<FormCity />);
		const input = screen.getByRole("textbox");

		fireEvent.change(input, { target: { value: "Porto Alegre" } });
		await finishDebounce();

		fireEvent.click(screen.getByRole("button", { name: /Porto Alegre/i }));
		expect(screen.getByRole("dialog")).toBeInTheDocument();

		fireEvent.click(
			screen.getByRole("button", { name: "Fechar detalhes da cidade" }),
		);
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: "Favoritar" }));
		fireEvent.change(input, { target: { value: "" } });

		expect(
			screen.getByRole("heading", { name: "Cidades favoritas" }),
		).toBeInTheDocument();
		expect(screen.getByText("Porto Alegre")).toBeInTheDocument();
		expect(JSON.parse(localStorage.getItem("favoriteCities") ?? "[]")).toEqual([
			portoAlegre,
		]);
	});

	it("usuário iniciante: tenta pesquisar sem informar uma cidade", async () => {
		const fetchMock = vi.fn();
		vi.stubGlobal("fetch", fetchMock);
		render(<FormCity />);
		const input = screen.getByRole("textbox");

		expect(
			screen.getByText("Digite o nome e escolha uma localidade nos resultados."),
		).toBeInTheDocument();
		fireEvent.change(input, { target: { value: "   " } });
		await finishDebounce();

		expect(fetchMock).not.toHaveBeenCalled();
		expect(
			screen.getByText("Você ainda não possui cidades favoritas."),
		).toBeInTheDocument();
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("usuário caótico: usa dados corrompidos, digita rapidamente e enfrenta erro da API", async () => {
		localStorage.setItem("favoriteCities", "{dados quebrados");
		const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500 });
		const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
		vi.stubGlobal("fetch", fetchMock);
		render(<FormCity />);
		const input = screen.getByRole("textbox");

		fireEvent.change(input, { target: { value: "P" } });
		fireEvent.change(input, { target: { value: "Po" } });
		fireEvent.change(input, { target: { value: "Cidade impossível" } });
		await finishDebounce();

		expect(fetchMock).toHaveBeenCalledOnce();
		const requestedUrl = String(fetchMock.mock.calls[0][0]);
		expect(new URL(requestedUrl).searchParams.get("name")).toBe(
			"Cidade impossível",
		);
		expect(consoleError).toHaveBeenCalledOnce();
		expect(
			screen.getByText(
				"Não foi possível buscar cidades. Tente novamente em alguns instantes.",
			),
		).toBeInTheDocument();
		expect(screen.getByText("Nenhuma cidade encontrada.")).toBeInTheDocument();
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		expect(localStorage.getItem("favoriteCities")).toBe("[]");
	});
});
