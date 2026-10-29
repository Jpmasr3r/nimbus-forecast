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
});
