import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CityModal } from "../src/CityModal";

const modalProps = {
	id: 1,
	name: "Porto Alegre",
	country: "Brasil",
	latitude: -30.03,
	longitude: -51.23,
};

describe("CityModal", () => {
	it("abre como diálogo modal com os dados da cidade", () => {
		render(<CityModal {...modalProps} onClose={vi.fn()} />);

		const dialog = screen.getByRole("dialog");
		expect(dialog).toHaveAttribute("open");
		expect(dialog).toHaveClass("city-modal");
		expect(screen.getByText("Porto Alegre")).toBeInTheDocument();
		expect(screen.getByText("Brasil")).toBeInTheDocument();
	});

	it("solicita o fechamento pelo botão", () => {
		const onClose = vi.fn();
		render(<CityModal {...modalProps} onClose={onClose} />);

		fireEvent.click(
			screen.getByRole("button", { name: "Fechar detalhes da cidade" }),
		);

		expect(onClose).toHaveBeenCalledOnce();
	});

	it("solicita o fechamento ao pressionar Esc", () => {
		const onClose = vi.fn();
		render(<CityModal {...modalProps} onClose={onClose} />);
		const cancelEvent = new Event("cancel", { cancelable: true });

		fireEvent(screen.getByRole("dialog"), cancelEvent);

		expect(cancelEvent.defaultPrevented).toBe(true);
		expect(onClose).toHaveBeenCalledOnce();
	});

	it("fecha ao clicar no fundo, mas não no conteúdo", () => {
		const onClose = vi.fn();
		render(<CityModal {...modalProps} onClose={onClose} />);

		fireEvent.click(screen.getByText("Detalhes da cidade"));
		expect(onClose).not.toHaveBeenCalled();

		fireEvent.click(screen.getByRole("dialog"));
		expect(onClose).toHaveBeenCalledOnce();
	});

	it("mostra loading e notifica quando o clima é carregado", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
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
						temperature_2m: 22,
						relative_humidity_2m: 70,
						apparent_temperature: 23,
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
						time: ["2026-11-04"],
						weather_code: [0],
						temperature_2m_max: [25],
						temperature_2m_min: [15],
						precipitation_probability_max: [10],
					},
				}),
			}),
		);

		render(<CityModal {...modalProps} onClose={vi.fn()} />);
		expect(
			screen.getByText("Carregando informações meteorológicas..."),
		).toBeInTheDocument();

		expect(
			await screen.findByText("Informações meteorológicas carregadas com sucesso."),
		).toBeInTheDocument();
		expect(screen.queryByText("Carregando informações meteorológicas...")).not.toBeInTheDocument();
		expect(screen.getByText("22°C")).toBeInTheDocument();
	});

	it("encerra o loading e notifica quando a consulta do clima falha", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({ ok: false, status: 500 }),
		);
		render(<CityModal {...modalProps} onClose={vi.fn()} />);

		const messages = await screen.findAllByText(
			"Não foi possível consultar o clima.",
		);

		expect(messages).toHaveLength(2);
		expect(screen.queryByText("Carregando informações meteorológicas...")).not.toBeInTheDocument();
	});
});
