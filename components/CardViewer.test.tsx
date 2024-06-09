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
    {
        id: 3,
        round_id: 222,
        artist: "Artist3",
        song_title: "Song3",
        played: false,
    },
    {
        id: 4,
        round_id: 222,
        artist: "Artist4",
        song_title: "Song4",
        played: true,
    },
    {
        id: 5,
        round_id: 222,
        artist: "Artist5",
        song_title: "Song5",
        played: false,
    },
    {
        id: 6,
        round_id: 222,
        artist: "Artist6",
        song_title: "Song6",
        played: true,
    },
    {
        id: 7,
        round_id: 222,
        artist: "Artist7",
        song_title: "Song7",
        played: false,
    },
    {
        id: 8,
        round_id: 222,
        artist: "Artist8",
        song_title: "Song8",
        played: true,
    },
    {
        id: 9,
        round_id: 222,
        artist: "Artist9",
        song_title: "Song9",
        played: false,
    },
    {
        id: 10,
        round_id: 222,
        artist: "Artist10",
        song_title: "Song10",
        played: true,
    },
    {
        id: 11,
        round_id: 222,
        artist: "Artist11",
        song_title: "Song11",
        played: false,
    },
    {
        id: 12,
        round_id: 222,
        artist: "Artist12",
        song_title: "Song12",
        played: true,
    },
    {
        id: 13,
        round_id: 222,
        artist: "Artist13",
        song_title: "Song13",
        played: false,
    },
    {
        id: 14,
        round_id: 222,
        artist: "Artist14",
        song_title: "Song14",
        played: true,
    },
    {
        id: 15,
        round_id: 222,
        artist: "Artist15",
        song_title: "Song15",
        played: false,
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
];

const mockPositions: Positions = {
    7777: [11, 1, 6, 7, 5, 3, 10, 2, 14, 15, 8, 4, 13, 12, 9],
    8888: [4, 6, 10, 15, 1, 9, 5, 12, 2, 11, 7, 3, 13, 14, 8],
    9999: [13, 6, 9, 12, 11, 3, 4, 1, 5, 7, 2, 10, 8, 14, 15],
};

describe("CardViewer", () => {
    it("shows Card Viewer and number of songs and cards", async () => {
        render(
            <CardViewer
                songs={mockSongs}
                songPositions={mockPositions}
                roundNumber={1}
            />
        );

        screen.getByText("Card Viewer");
        screen.getByText("Number of cards: 3");
    });
    it("displays 3 card grids", async () => {
        render(
            <CardViewer
                songs={mockSongs}
                songPositions={mockPositions}
                roundNumber={1}
            />
        );
        screen.getByLabelText("Card 7777");
        screen.getByLabelText("Card 8888");
        screen.getByLabelText("Card 9999");
    });
});
