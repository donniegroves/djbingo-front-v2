import { render, fireEvent, waitFor } from "@testing-library/react";
import NavBar from "./NavBar";

jest.mock("next/navigation", () => {
    const router = {
        push: jest.fn(),
    };
    return {
        useRouter: jest.fn().mockReturnValue(router),
        useParams: jest.fn().mockReturnValue({ game_id: 555 }),
    };
});

describe("NavBar", () => {
    it("renders the WINNER button and responds to click events when winner is true", async () => {
        const setActiveTab = jest.fn();
        const { getByRole } = render(
            <NavBar setActiveTab={setActiveTab} winner={true} />
        );

        waitFor(() => {
            const winnerButton = getByRole("button", {
                name: "WINNER",
            });
            fireEvent.click(winnerButton);
        });
        expect(setActiveTab).toHaveBeenCalledWith("cards");
    });
});
