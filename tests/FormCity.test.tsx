import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FormCity } from "../src/FormCity";

const portoAlegre = {
	id: 1,
	name: "Porto Alegre",
	country: "Brasil",
	latitude: -30.03,
	longitude: -51.23,
};

const lisboa = {
	id: 2,
	name: "Lisboa",
	country: "Portugal",
	latitude: 38.72,
	longitude: -9.14,
};

function successfulResponse(results: unknown[]): Response {
	return {
		ok: true,
		json: vi.fn().mockResolvedValue({ results }),
	} as unknown as Response;
}

async function finishDebounce(): Promise<void> {
	await act(async () => {
		await vi.advanceTimersByTimeAsync(500);
	});
}

describe("FormCity", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	it("não consulta a API antes do debounce e usa o texto atual do input", async () => {
		const fetchMock = vi.fn().mockResolvedValue(successfulResponse([lisboa]));
		vi.stubGlobal("fetch", fetchMock);
		render(<FormCity />);

		fireEvent.change(screen.getByRole("textbox"), {
			target: { value: "Lisboa" },
		});

		act(() => vi.advanceTimersByTime(499));
		expect(fetchMock).not.toHaveBeenCalled();

		await finishDebounce();

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const requestedUrl = String(fetchMock.mock.calls[0][0]);
		expect(new URL(requestedUrl).searchParams.get("name")).toBe("Lisboa");
		expect(screen.getByText("Lisboa")).toBeInTheDocument();
	});

	it("cancela a requisição anterior quando o texto muda", async () => {
		const signals: AbortSignal[] = [];
		const fetchMock = vi.fn((_url: string, options?: RequestInit) => {
			const signal = options?.signal as AbortSignal;
			signals.push(signal);

			return new Promise<Response>((_resolve, reject) => {
				signal.addEventListener("abort", () => {
					reject(new DOMException("Requisição cancelada", "AbortError"));
				});
			});
		});
		const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
		vi.stubGlobal("fetch", fetchMock);
		render(<FormCity />);

		fireEvent.change(screen.getByRole("textbox"), {
			target: { value: "Porto" },
		});
		await finishDebounce();
		expect(signals[0].aborted).toBe(false);

		fireEvent.change(screen.getByRole("textbox"), {
			target: { value: "Porto Alegre" },
		});

		expect(signals[0].aborted).toBe(true);
		await act(async () => Promise.resolve());
		expect(consoleError).not.toHaveBeenCalled();
	});

	it("exibe os favoritos salvos quando o input está vazio", () => {
		localStorage.setItem("favoriteCities", JSON.stringify([portoAlegre]));

		render(<FormCity />);

		expect(
			screen.getByRole("heading", { name: "Cidades favoritas" }),
		).toBeInTheDocument();
		expect(screen.getByText("Porto Alegre")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Remover favorito" }),
		).toBeInTheDocument();
	});

	it("adiciona sem duplicar e remove uma cidade dos favoritos", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(successfulResponse([portoAlegre])),
		);
		render(<FormCity />);

		fireEvent.change(screen.getByRole("textbox"), {
			target: { value: "Porto Alegre" },
		});
		await finishDebounce();

		const addButton = screen.getByRole("button", { name: "Favoritar" });
		fireEvent.click(addButton);

		expect(JSON.parse(localStorage.getItem("favoriteCities") ?? "[]")).toEqual([
			portoAlegre,
		]);
		expect(
			screen.getByRole("button", { name: "Remover favorito" }),
		).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: "Remover favorito" }));

		expect(JSON.parse(localStorage.getItem("favoriteCities") ?? "[]")).toEqual([]);
		expect(
			screen.getByRole("button", { name: "Favoritar" }),
		).toBeInTheDocument();
	});

	it("volta a mostrar somente favoritos quando o input é limpo", async () => {
		localStorage.setItem("favoriteCities", JSON.stringify([portoAlegre]));
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(successfulResponse([lisboa])),
		);
		render(<FormCity />);
		const input = screen.getByRole("textbox");

		fireEvent.change(input, { target: { value: "Lisboa" } });
		await finishDebounce();
		expect(screen.getByText("Lisboa")).toBeInTheDocument();
		expect(screen.queryByText("Porto Alegre")).not.toBeInTheDocument();

		fireEvent.change(input, { target: { value: "" } });

		expect(screen.getByText("Porto Alegre")).toBeInTheDocument();
		expect(screen.queryByText("Lisboa")).not.toBeInTheDocument();
	});

	it("abre e fecha os detalhes da cidade selecionada", () => {
		localStorage.setItem("favoriteCities", JSON.stringify([portoAlegre]));
		render(<FormCity />);

		fireEvent.click(screen.getByRole("button", { name: /Porto Alegre/i }));

		const dialog = screen.getByRole("dialog");
		expect(dialog).toBeInTheDocument();
		expect(
			within(dialog).getByRole("heading", { name: "Porto Alegre" }),
		).toBeInTheDocument();

		fireEvent.click(
			screen.getByRole("button", { name: "Fechar detalhes da cidade" }),
		);

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("fecha os detalhes ao clicar fora do conteúdo", () => {
		localStorage.setItem("favoriteCities", JSON.stringify([portoAlegre]));
		render(<FormCity />);

		fireEvent.click(screen.getByRole("button", { name: /Porto Alegre/i }));
		fireEvent.click(screen.getByRole("dialog"));

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});
});
