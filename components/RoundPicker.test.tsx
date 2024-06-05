import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RoundPicker from "@/components/RoundPicker";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => {
    const router = {
        push: jest.fn(),
    };
    return {
        useRouter: jest.fn().mockReturnValue(router),
        useParams: jest.fn().mockReturnValue({ game_id: 555 }),
    };
});

const mockSuccessResponse: Round[] = [
    {
        id: 1,
        round_number: 123,
        round_name: "Smooth R&B",
    },
    {
        id: 2,
        round_number: 124,
        round_name: "Applesauce Round",
    },
];
const mockJsonPromise = Promise.resolve(mockSuccessResponse);
const mockFetchPromise = Promise.resolve({ json: () => mockJsonPromise });
global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

describe("RoundPicker", () => {
    it("renders the expected heading, and shows initial no rounds message", () => {
        render(<RoundPicker />);

        const heading = screen.getByRole("heading", { level: 1 });
        expect(heading).toHaveTextContent("Available rounds for game 555:");

        const errMsg = screen.queryByText("No rounds found.");
        expect(errMsg).toBeInTheDocument();
    });

    it("when fetch succeeds, renders the rounds", async () => {
        render(<RoundPicker />);

        await waitFor(() => {
            const round1Div = screen.getByRole("button", {
                name: "Smooth R&B",
            });
            expect(round1Div).toBeInTheDocument();
        });
    });

    it("when fetch fails, shows an error message", async () => {
        global.fetch = jest
            .fn()
            .mockImplementation(() => Promise.reject("Error"));

        render(<RoundPicker />);

        await waitFor(() => {
            const error = screen.getByText("Failed to fetch rounds.");
            expect(error).toBeInTheDocument();
        });
    });

    it("when round button clicked, pushes the user to the correct URL", async () => {
        global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
        render(<RoundPicker />);

        await waitFor(() => {
            const round1Div = screen.getByRole("button", {
                name: "Applesauce Round",
            });
            fireEvent.click(round1Div);
        });

        expect(useRouter().push).toHaveBeenCalledTimes(1);
        expect(useRouter().push).toHaveBeenCalledWith("/555/2");

        const error = screen.queryByText("Failed to fetch rounds.");
        expect(error).not.toBeInTheDocument();
    });
});
