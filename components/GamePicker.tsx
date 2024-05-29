"use client";

import AppContext from "@/context/AppContext";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";

export default function GamePicker() {
    const [gameIdInputValue, setGameIdInputValue] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const context = useContext(AppContext);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const gameRoundsResponse = await fetch(`/${gameIdInputValue}`);
            const gameRoundsData: Round[] = await gameRoundsResponse.json();

            context?.setGameId(parseInt(gameIdInputValue));
            context?.setRounds(gameRoundsData);
        } catch {
            setError("Error fetching rounds data.");
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
