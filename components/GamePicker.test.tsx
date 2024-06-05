import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GamePicker from "@/components/GamePicker";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => {
    const router = {
        push: jest.fn(),
    };
    return {
        useRouter: jest.fn().mockReturnValue(router),
    };
});

function setup() {
    process.env = Object.assign(process.env, {
        NEXT_PUBLIC_API_URL: "TEST_API_URL",
    });
    render(<GamePicker />);
}

describe("GamePicker", () => {
    it("renders the expected heading, paragraph, input, and button", () => {
        setup();

        const heading = screen.getByRole("heading", { level: 1 });
        expect(heading).toHaveTextContent("Welcome to BB!");

        const paragraph = screen.getByRole("paragraph");
        expect(paragraph).toHaveTextContent(
            "Input a game number to get started."
        );

        const input = screen.getByLabelText("Game #:");
        expect(input).toBeInTheDocument();

        const button = screen.getByRole("button", { name: "Get Started" });
        expect(button).toBeInTheDocument();

        const error1 = screen.queryByText("Please enter a game number.");
        expect(error1).not.toBeInTheDocument();

        const error2 = screen.queryByText("Game number must be a number.");
        expect(error2).not.toBeInTheDocument();
    });

    it("renders an error message if the input is empty", () => {
        setup();

        const button = screen.getByRole("button", { name: "Get Started" });

        fireEvent.click(button);

        const error = screen.getByText("Please enter a game number.");
        expect(error).toBeInTheDocument();
    });

    it("renders an error message if the input is not a number", () => {
        setup();

        const input = screen.getByLabelText("Game #:");
        const button = screen.getByRole("button", { name: "Get Started" });

        fireEvent.change(input, { target: { value: "abc" } });
        fireEvent.click(button);

        const error = screen.getByText("Game number must be a number.");
        expect(error).toBeInTheDocument();
    });

    it("when a number is input, the user is pushed to the correct URL", async () => {
        setup();
        const input = screen.getByLabelText("Game #:");
        const button = screen.getByRole("button", { name: "Get Started" });

        fireEvent.change(input, { target: { value: "555" } });
        fireEvent.click(button);

        expect(useRouter().push).toHaveBeenCalledTimes(1);
        expect(useRouter().push).toHaveBeenCalledWith("/555");
    });
});
