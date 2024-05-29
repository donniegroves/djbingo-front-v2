import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import RoundPicker from "@/components/RoundPicker";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => {
    const router = {
        push: jest.fn(),
        query: {},
    };
    return {
        useRouter: jest.fn().mockReturnValue(router),
        useParams: jest.fn().mockReturnValue({ game_id: 555 }),
    };
});

const defaultRounds = [
    {
        id: 1,
        game_id: 555,
        round_number: 123,
        round_name: "Smooth R&B",
    },
    {
        id: 2,
        game_id: 555,
        round_number: 124,
        round_name: "Applesauce Round",
    },
];

describe("RoundPicker", () => {
    it("renders the expected heading, and round divs", () => {
        render(<RoundPicker rounds={defaultRounds} />);

        const heading = screen.getByRole("heading", { level: 1 });
        expect(heading).toHaveTextContent("Available rounds for game 555:");

        const round1Div = screen.getByRole("button", { name: "Smooth R&B" });
        expect(round1Div).toBeInTheDocument();

        const round2Div = screen.getByRole("button", {
            name: "Applesauce Round",
        });
        expect(round2Div).toBeInTheDocument();

        const errMsg = screen.queryByText("No rounds found.");
        expect(errMsg).not.toBeInTheDocument();
    });
    it("displays message when there are no rounds", () => {
        render(<RoundPicker rounds={[]} />);

        const errMsg = screen.getByText("No rounds found.");
        expect(errMsg).toBeInTheDocument();
    });

    it("when round button clicked, pushes the user to the correct URL", async () => {
        render(<RoundPicker rounds={defaultRounds} />);

        const round1Div = screen.getByRole("button", {
            name: "Applesauce Round",
        });
        fireEvent.click(round1Div);

        expect(useRouter().push).toHaveBeenCalledTimes(1);
        expect(useRouter().push).toHaveBeenCalledWith("/555/2");

        const error = screen.queryByText("Error fetching round data.");
        expect(error).not.toBeInTheDocument();
    });
});
