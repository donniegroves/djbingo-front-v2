import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import SongCardPage from "./SongCardPage";

jest.mock("next/navigation", () => {
    const router = {
        push: jest.fn(),
    };
    return {
        useRouter: jest.fn().mockReturnValue(router),
        useParams: jest.fn().mockReturnValue({ game_id: 555, round_id: 222 }),
    };
});

function mockFetchInit(
    responseData: RoundDataResponse | null,
    error: boolean = false
) {
    if (error) {
        global.fetch = jest
            .fn()
            .mockImplementation(() => Promise.reject("Error"));
    } else {
        const mockJsonPromise = Promise.resolve(responseData);
        const mockFetchPromise = Promise.resolve({
            json: () => mockJsonPromise,
        });
        global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
    }
}

const mockCompleteResponse: RoundDataResponse = {
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
};
const mockedIncompleteDataResponse: RoundDataResponse = {
    isProcessingMessage: "Still collecting data. 0 cards processed out of 300.",
    songs: [],
    positions: {},
};

function setup(responseData: RoundDataResponse | null, error: boolean = false) {
    process.env = Object.assign(process.env, {
        NEXT_PUBLIC_API_URL: "TEST_API_URL",
    });

    mockFetchInit(responseData, error);

    render(<SongCardPage />);
}

describe("SongCardPage", () => {
    it("error fetching data, displays error message", async () => {
        setup(null, true);

        await waitFor(() => {
            const errorMsg = screen.getByText("Error fetching round data.");
            expect(errorMsg).toBeInTheDocument();
        });
    });
    it("makes initial call to API for round, displays 3 songs", async () => {
        setup(mockCompleteResponse);

        await waitFor(() => {
            expect(
                screen.getByText("Songs in this round: 3")
            ).toBeInTheDocument();
        });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith("TEST_API_URL/r/222");

        const song1Div = screen.getByRole("button", { name: "Song1 Artist1" });
        expect(song1Div).toBeInTheDocument();
        const song2Div = screen.getByRole("button", { name: "Song2 Artist2" });
        expect(song2Div).toBeInTheDocument();
        const song3Div = screen.getByRole("button", { name: "Song3 Artist3" });
        expect(song3Div).toBeInTheDocument();
    });
    it("display loading indicator, passing along message from api", async () => {
        setup(mockedIncompleteDataResponse);

        await waitFor(() => {
            screen.getByRole("img", {
                name: "Loading Spinner",
            });
            screen.getByText(
                "Still collecting data. 0 cards processed out of 300."
            );
        });
    });
});
