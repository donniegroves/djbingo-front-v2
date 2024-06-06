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

describe("CardViewer", () => {
    it("shows Card Viewer", async () => {
        render(<CardViewer />);

        screen.getByText("Card Viewer");
    });
});
