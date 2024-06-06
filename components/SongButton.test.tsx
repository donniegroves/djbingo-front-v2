import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SongButton from "./SongButton";
import { ok } from "assert";

function mockFetchInit(
    responseData: { data: Song } | null,
    error: boolean = false
) {
    if (error) {
        console.log("error was true!!");
        global.fetch = jest
            .fn()
            .mockImplementation(() => Promise.reject("Error"));
    } else if (responseData) {
        const mockJsonPromise = Promise.resolve(responseData);
        const mockFetchPromise = Promise.resolve({
            json: () => mockJsonPromise,
            ok: true,
        });
        global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
    }
}

const mockSuccessResponse: { data: Song } = {
    data: {
        id: 1,
        round_id: 222,
        artist: "Artist1",
        song_title: "Song1",
        played: true,
    },
};

function setup(responseData: { data: Song } | null, error: boolean = false) {
    process.env = Object.assign(process.env, {
        NEXT_PUBLIC_API_URL: "TEST_API_URL",
    });

    mockFetchInit(responseData, error);

    render(
        <SongButton
            song={{
                id: 1,
                round_id: 222,
                artist: "Artist1",
                song_title: "Song1",
                played: false,
            }}
            setSongs={() => {}}
            setErrorMsg={() => {}}
        />
    );
}

describe("SongButton", () => {
    it("displays song title and artist", () => {
        setup(null, false);

        expect(screen.getByText("Song1")).toBeInTheDocument();
        expect(screen.getByText("Artist1")).toBeInTheDocument();
    });
    it("displays error when fetch error occurs", async () => {
        setup(null, true);

        const song1Div = screen.getByRole("button", { name: "Song1 Artist1" });
        fireEvent.click(song1Div);

        await waitFor(() => {
            screen.getByText("Problem with toggling played status.");
        });
    });
    it("makes a fetch call when clicked and changes played status", async () => {
        setup(mockSuccessResponse, false);

        const song1Div = screen.getByRole("button", { name: "Song1 Artist1" });
        fireEvent.click(song1Div);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
            expect(fetch).toHaveBeenCalledWith("TEST_API_URL/toggle/1/1");
        });

        await waitFor(() => {
            const playedDiv = screen.getByRole("button", {
                name: "Song1 Artist1",
            });
            expect(playedDiv).toHaveClass("played");
        });
    });
});
