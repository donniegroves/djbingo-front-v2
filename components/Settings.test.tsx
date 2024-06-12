import "@testing-library/jest-dom";
import { render, waitFor, screen } from "@testing-library/react";
import Settings from "./Settings";

function mockFetchInit(
    responseData: MockSuccessResponse | null,
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
            ok: true,
        });
        global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
    }
}

type MockSuccessResponse = {
    message: string;
    setting: {
        id: number;
        key: string;
        value: string;
        created_at: string | null;
        updated_at: string;
    };
};
const mockSuccessResponse: MockSuccessResponse = {
    message: "Setting updated successfully!",
    setting: {
        id: 1,
        key: "max_cards",
        value: "20",
        created_at: null,
        updated_at: "2024-06-12T00:16:36.000000Z",
    },
};

function setup(
    responseData: MockSuccessResponse | null,
    error: boolean = false
) {
    process.env = Object.assign(process.env, {
        NEXT_PUBLIC_API_URL: "TEST_API_URL",
    });

    mockFetchInit(responseData, error);

    render(<Settings />);
}

describe("Settings", () => {
    it("error fetching data, displays error message", async () => {
        setup(null, true);

        await waitFor(() => {
            const errorMsg = screen.getByText("Failed to fetch settings.");
            expect(errorMsg).toBeInTheDocument();
        });
    });
    it("makes initial call to API for settings, shows inputs", async () => {
        setup(mockSuccessResponse);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith("TEST_API_URL/settings");

        await waitFor(() => {
            expect(
                screen.getByRole("spinbutton", { name: "Max Cards" })
            ).toBeInTheDocument();
        });
    });
});
