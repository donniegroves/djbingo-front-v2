import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CardViewer from "./CardViewer";

jest.mock("next/navigation", () => {
    const router = {
        push: jest.fn(),
    };
    return {
        useRouter: jest.fn().mockReturnValue(router),
        useParams: jest.fn().mockReturnValue({ game_id: 555, round_id: 222 }),
    };
});

const mockFinalCards: CardsForViewer = [
    {
        cardId: "7777",
        playedPositions: [
            false,
            true,
            false,
            false,
            true,
            false,
            true,
            true,
            false,
            false,
            true,
            true,
            false,
            false,
            true,
        ],
    },
    {
        cardId: "8888",
        playedPositions: [
            true,
            false,
            true,
            false,
            false,
            true,
            false,
            false,
            true,
            true,
            false,
            false,
            true,
            true,
            false,
        ],
    },
    {
        cardId: "9999",
        playedPositions: [
            false,
            false,
            true,
            false,
            true,
            true,
            false,
            true,
            false,
            false,
            true,
            true,
            false,
            true,
            false,
        ],
    },
];

describe("CardViewer", () => {
    it("shows Card Viewer and number of songs and cards", async () => {
        render(<CardViewer finalCards={mockFinalCards} winningCards={[]} />);

        screen.getByText("Number of cards: 3");
        screen.getByLabelText("Card 7777");
        screen.getByLabelText("Card 8888");
        screen.getByLabelText("Card 9999");
    });
    it("shows winning cards", async () => {
        render(<CardViewer finalCards={[]} winningCards={mockFinalCards} />);

        screen.getByText("Number of cards: 0");
        screen.getByLabelText("Card 7777");
        screen.getByLabelText("Card 8888");
        screen.getByLabelText("Card 9999");
    });
});
