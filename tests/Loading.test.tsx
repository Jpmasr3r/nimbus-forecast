import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Loading } from "../src/Loading";

describe("Loading", () => {
	it("exibe a mensagem informada como um status acessível", () => {
		render(<Loading message="Buscando cidades..." />);

		expect(screen.getByRole("status")).toHaveTextContent("Buscando cidades...");
	});
});
