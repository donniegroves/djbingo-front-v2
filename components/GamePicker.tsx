"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GamePicker() {
    const [gameIdInputValue, setGameIdInputValue] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!gameIdInputValue || gameIdInputValue === "") {
            setError("Please enter a game number.");
            return;
        }

        if (isNaN(Number(gameIdInputValue))) {
            setError("Game number must be a number.");
            return;
        }

        router.push(`/${gameIdInputValue}`);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGameIdInputValue(event.target.value);
    };

    return (
        <main className="p-3 flex items-center justify-center min-h-screen">
            <form
                className="flex flex-col gap-y-2 text-center"
                onSubmit={handleSubmit}
            >
                <h1 className="text-2xl mb-8">Welcome to BingoBeater!</h1>
                <label htmlFor="game_id" className="text-lg">
                    Input a game number:
                </label>
                <div className="flex flex-row m-auto h-[32px] text-lg">
                    <input
                        type="text"
                        id="game_id"
                        name="game_id"
                        className="max-w-20 text-center mr-3 h-full rounded"
                        value={gameIdInputValue}
                        onChange={handleInputChange}
                    />
                    <div
                        className="flex flex-row cursor-pointer justify-center items-center h-full px-4 bg-blue-500 hover:bg-blue-700 rounded"
                        onClick={handleSubmit}
                        role="button"
                    >
                        Go
                    </div>
                </div>

                {error && <p>{error}</p>}
            </form>
        </main>
    );
}
