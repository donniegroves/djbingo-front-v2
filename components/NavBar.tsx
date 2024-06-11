"use client";

import { useParams, useRouter } from "next/navigation";

type NavBarProps = {
    setActiveTab: React.Dispatch<React.SetStateAction<"cards" | "songs">>;
    winner: boolean;
};

const NavBar: React.FC<NavBarProps> = ({ setActiveTab, winner }) => {
    const router = useRouter();
    const params = useParams();

    function toggleActiveTab() {
        setActiveTab((prev) => (prev === "songs" ? "cards" : "songs"));
    }

    return (
        <nav className="flex justify-between items-center h-12 border-b">
            <button
                className="flex-1 text-center border-r"
                onClick={() => {
                    router.push("/");
                }}
            >
                Game
            </button>
            <button
                className={`flex-1 text-center border-r border-l`}
                onClick={() => {
                    router.push(`/${params.game_id}`);
                }}
            >
                Round
            </button>
            <button
                className="flex-1 text-center border-r border-l"
                onClick={() => {
                    toggleActiveTab();
                }}
            >
                S/C
            </button>
            <button
                className="flex-1 text-center border-r border-l"
                onClick={() => {
                    // TODO
                    alert("Coming soon...");
                }}
            >
                Settings
            </button>
            <button
                className={`flex-1 text-center border-l ${
                    winner
                        ? "font-bold text-green-500 winner-notif animate-blink"
                        : ""
                }`}
                disabled={!winner}
                onClick={() => {
                    setActiveTab("cards");
                }}
            >
                WINNER
            </button>
        </nav>
    );
};

export default NavBar;
