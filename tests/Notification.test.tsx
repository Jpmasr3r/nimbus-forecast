import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Notification } from "../src/Notification";

describe("Notification", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	it("oculta uma mensagem de 10 palavras após 5 segundos", () => {
		const message = "uma duas três quatro cinco seis sete oito nove dez";
		render(<Notification message={message} />);

		act(() => vi.advanceTimersByTime(4_999));
		expect(screen.getByRole("status")).toBeInTheDocument();

		act(() => vi.advanceTimersByTime(1));
		expect(screen.queryByRole("status")).not.toBeInTheDocument();
	});

	it("oculta uma mensagem de 20 palavras após 10 segundos", () => {
		const message = Array.from({ length: 20 }, (_, index) => `palavra${index}`).join(
			" ",
		);
		render(<Notification message={message} />);

		act(() => vi.advanceTimersByTime(9_999));
		expect(screen.getByRole("status")).toBeInTheDocument();

		act(() => vi.advanceTimersByTime(1));
		expect(screen.queryByRole("status")).not.toBeInTheDocument();
	});

	it("pode ser fechada manualmente", () => {
		const onClose = vi.fn();
		render(<Notification message="Mensagem curta" onClose={onClose} />);

		fireEvent.click(screen.getByRole("button", { name: "Fechar notificação" }));

		expect(screen.queryByRole("status")).not.toBeInTheDocument();
		expect(onClose).toHaveBeenCalledOnce();
	});

	it("usa alerta assertivo para uma notificação de erro", () => {
		render(<Notification message="Falha na operação" variant="error" />);

		const notification = screen.getByRole("alert");
		expect(notification).toHaveClass("is-error");
		expect(notification).toHaveAttribute("aria-live", "assertive");
	});

	it("usa status educado para uma notificação de sucesso", () => {
		render(<Notification message="Operação concluída" variant="success" />);

		const notification = screen.getByRole("status");
		expect(notification).toHaveClass("is-success");
		expect(notification).toHaveAttribute("aria-live", "polite");
	});
});
