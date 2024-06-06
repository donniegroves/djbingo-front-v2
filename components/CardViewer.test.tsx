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

const mockSongs: Song[] = [
    {
        id: 1,
        round_id: 222,
        artist: "Artist1",
        song_title: "Song1",
        played: false,
    },
    {
        id: 2,
        round_id: 222,
        artist: "Artist2",
        song_title: "Song2",
        played: true,
    },
];

const mockCards: Card[] = [
    {
        id: 1,
        ext_card_id: 7777,
        round_id: 222,
    },
    {
        id: 2,
        ext_card_id: 8888,
        round_id: 222,
    },
    {
        id: 3,
        ext_card_id: 9999,
        round_id: 222,
    },
    {
        id: 4,
        ext_card_id: 1010,
        round_id: 222,
    },
];

describe("CardViewer", () => {
    it("shows Card Viewer and number of songs and cards", async () => {
        render(<CardViewer songs={mockSongs} cards={mockCards} />);

        screen.getByText("Card Viewer");
        screen.getByText("Number of songs: 2");
        screen.getByText("Number of cards: 4");
    });
    it("displays 4 card grids", async () => {
        render(<CardViewer songs={mockSongs} cards={mockCards} />);
        screen.getByLabelText("Card 1");
        screen.getByLabelText("Card 2");
        screen.getByLabelText("Card 3");
        screen.getByLabelText("Card 4");
    });
});
