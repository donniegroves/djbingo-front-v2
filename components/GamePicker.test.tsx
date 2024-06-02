import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GamePicker from "@/components/GamePicker";
import { useRouter } from "next/navigation";
import fetchMock from "jest-fetch-mock";

jest.mock("next/navigation", () => {
    const router = {
        push: jest.fn(),
    };
    return {
        useRouter: jest.fn().mockReturnValue(router),
    };
});
fetchMock.enableMocks();

const mockGameDataResponse = {
    isProcessingMessage: null,
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
};
fetchMock.mockResponseOnce(JSON.stringify(mockGameDataResponse));

function setup(mockedResponse: GameDataResponse | undefined = undefined) {
    fetchMock.resetMocks();
    process.env = Object.assign(process.env, {
        NEXT_PUBLIC_API_URL: "TEST_API_URL",
    });

    if (mockedResponse) {
        fetchMock.mockResponseOnce(JSON.stringify(mockedResponse));
    }
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

        const error = screen.queryByText("Error fetching rounds data.");
        expect(error).not.toBeInTheDocument();
    });

    it("receives a successful API response, then pushes the user to the correct URL when clicked, with no error displayed", async () => {
        setup(mockGameDataResponse);
        const input = screen.getByLabelText("Game #:");
        const button = screen.getByRole("button", { name: "Get Started" });

        fireEvent.change(input, { target: { value: "555" } });
        fireEvent.click(button);

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
        await waitFor(() =>
            expect(fetch).toHaveBeenCalledWith("TEST_API_URL/g/555")
        );

        expect(useRouter().push).toHaveBeenCalledTimes(1);
        expect(useRouter().push).toHaveBeenCalledWith("/555");

        const error = screen.queryByText("Error fetching rounds data.");
        expect(error).not.toBeInTheDocument();
    });
    it("receives a bad response from API and renders an error message", async () => {
        fetchMock.mockRejectOnce(new Error("Network error."));

        setup();

        const input = screen.getByLabelText("Game #:");
        const button = screen.getByRole("button", { name: "Get Started" });

        fireEvent.change(input, { target: { value: "555" } });
        fireEvent.click(button);

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
        await waitFor(() =>
            expect(fetch).toHaveBeenCalledWith("TEST_API_URL/g/555")
        );

        const error = screen.getByText("Error fetching rounds data.");
        expect(error).toBeInTheDocument();
    });
});
