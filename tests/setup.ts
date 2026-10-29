import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

if (!HTMLDialogElement.prototype.showModal) {
	HTMLDialogElement.prototype.showModal = function showModal() {
		this.setAttribute("open", "");
	};
}

if (!HTMLDialogElement.prototype.close) {
	HTMLDialogElement.prototype.close = function close() {
		this.removeAttribute("open");
	};
}

afterEach(() => {
	cleanup();
	localStorage.clear();
	vi.clearAllTimers();
	vi.useRealTimers();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});
