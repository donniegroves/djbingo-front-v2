import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import SongPicker from "./SongPicker";
import fetchMock from "jest-fetch-mock";

jest.mock("next/navigation", () => {
    const router = {
        push: jest.fn(),
    };
    return {
        useRouter: jest.fn().mockReturnValue(router),
        useParams: jest.fn().mockReturnValue({ game_id: 555, round_id: 222 }),
    };
});
fetchMock.enableMocks();

const mockedCompleteDataResponse: RoundDataResponse = {
    isProcessingMessage: null,
    songs: [
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
    ],
    cards: [
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
    ],
};
const mockedIncompleteDataResponse: RoundDataResponse = {
    isProcessingMessage: "Still collecting data. 0 cards processed out of 300.",
    songs: [],
    cards: [],
};

function setup(mockedObject: RoundDataResponse | undefined) {
    fetchMock.resetMocks();
    process.env = Object.assign(process.env, {
        NEXT_PUBLIC_API_URL: "TEST_API_URL",
    });

    if (mockedObject === undefined) {
        render(<SongPicker />);
    } else {
        fetchMock.mockResponseOnce(JSON.stringify(mockedObject));
        render(<SongPicker />);
    }
}

describe("SongPicker", () => {
    it("makes initial call to API for round, populates context, displays 3 songs provided by context and when clicked, makes a call to api to toggle played", async () => {
        setup(mockedCompleteDataResponse);

        await waitFor(() => {
            expect(
                screen.getByText("Songs in this round: 3")
            ).toBeInTheDocument();
        });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith("TEST_API_URL/r/222");

        const song1Div = screen.getByRole("button", { name: "Artist1 Song1" });
        expect(song1Div).toBeInTheDocument();
        const song2Div = screen.getByRole("button", { name: "Artist2 Song2" });
        expect(song2Div).toBeInTheDocument();
        const song3Div = screen.getByRole("button", { name: "Artist3 Song3" });
        expect(song3Div).toBeInTheDocument();
    });
    it("when clicking songs, makes a call to api to toggle played", async () => {
        setup(mockedCompleteDataResponse);

        await waitFor(() => {
            expect(
                screen.getByText("Songs in this round: 3")
            ).toBeInTheDocument();
        });

        const song2Div = screen.getByRole("button", { name: "Artist2 Song2" });
        const song3Div = screen.getByRole("button", { name: "Artist3 Song3" });
        fireEvent.click(song2Div);
        fireEvent.click(song3Div);

        expect(fetch).toHaveBeenCalledTimes(3);
        expect(fetch).toHaveBeenNthCalledWith(1, "TEST_API_URL/r/222");
        expect(fetch).toHaveBeenNthCalledWith(2, "TEST_API_URL/toggle/2/0");
        expect(fetch).toHaveBeenNthCalledWith(3, "TEST_API_URL/toggle/3/1");
    });
    it("display loading indicator, passing along message from api", async () => {
        setup(mockedIncompleteDataResponse);

        await waitFor(() => {
            const loadingSpinner = screen.getByRole("img", {
                name: "Loading Spinner",
            });
            expect(loadingSpinner).toBeInTheDocument();

            const loadingMsg = screen.getByText(
                "Still collecting data. 0 cards processed out of 300."
            );
            expect(loadingMsg).toBeInTheDocument();
        });
    });
});
