import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GamePicker from "@/components/GamePicker";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => {
    const router = {
        push: jest.fn(),
        query: {},
    };
    return {
        useRouter: jest.fn().mockReturnValue(router),
    };
});

describe("GamePicker", () => {
    it("renders the expected heading, paragraph, input, and button", () => {
        render(<GamePicker />);

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

        const error = screen.queryByText("Error fetching rounds data.");
        expect(error).not.toBeInTheDocument();
    });

    it("receives a successful API response, then pushes the user to the correct URL when clicked, with no error displayed", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: (): Promise<GameDataResponse> =>
                    Promise.resolve({
                        isProcessing: false,
                        cur_card_perc: 100,
                        rounds: [
                            {
                                id: 1,
                                game_id: 555,
                                round_number: 1,
                                round_name: "Round 1",
                            },
                        ],
                        message: "All cards processed and rounds received.",
                    }),
            })
        ) as jest.Mock;

        render(<GamePicker />);
        const input = screen.getByLabelText("Game #:");
        const button = screen.getByRole("button", { name: "Get Started" });

        fireEvent.change(input, { target: { value: "555" } });
        fireEvent.click(button);

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(global.fetch).toHaveBeenCalledWith("/555"));

        expect(useRouter().push).toHaveBeenCalledTimes(1);
        expect(useRouter().push).toHaveBeenCalledWith("/555");
  
        const error = screen.queryByText("Error fetching rounds data.");
        expect(error).not.toBeInTheDocument();
    });
    it("receives a bad response from API and renders an error message", async () => {
        global.fetch = jest.fn(() =>
            Promise.reject("Network error.")
        ) as jest.Mock;

        render(<GamePicker />);
        const input = screen.getByLabelText("Game #:");
        const button = screen.getByRole("button", { name: "Get Started" });

        fireEvent.change(input, { target: { value: "555" } });
        fireEvent.click(button);

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(global.fetch).toHaveBeenCalledWith("/555"));
      
        const error = screen.getByText("Error fetching rounds data.");
        expect(error).toBeInTheDocument();
    });
});
