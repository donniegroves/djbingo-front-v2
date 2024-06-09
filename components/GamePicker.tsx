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
        <main className="flex min-h-screen flex-col items-center justify-center text-center p-24">
            <form className="flex flex-col gap-y-2" onSubmit={handleSubmit}>
                <h1 className="text-xl">Welcome to BB!</h1>
                <p>Input a game number to get started.</p>
                <label htmlFor="game_id">
                    Game #:
                    <input
                        type="text"
                        id="game_id"
                        name="game_id"
                        className="max-w-20 text-center"
                        value={gameIdInputValue}
                        onChange={handleInputChange}
                    />
                </label>
                <button onClick={handleSubmit} type="submit">
                    Get Started
                </button>
                {error && <p>{error}</p>}
            </form>
        </main>
    );
}
