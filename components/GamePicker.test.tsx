import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import GamePicker from "@/components/GamePicker";

describe("Page", () => {
    it("renders a heading", () => {
        render(<GamePicker />);

        const heading = screen.getByRole("heading", { level: 1 });

        expect(heading).toBeInTheDocument();
    });
});
