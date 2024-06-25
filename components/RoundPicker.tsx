"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function RoundPicker() {
    const router = useRouter();
    const { game_id } = useParams() as { game_id: string };
    const [rounds, setRounds] = useState<Round[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRounds = async () => {
            try {
                const gameRoundsResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/g/${game_id}`
                );
                const gameRoundsData: Round[] = await gameRoundsResponse.json();
                setRounds(gameRoundsData);
            } catch {
                setError("Failed to fetch rounds.");
            }
        };

        fetchRounds();
    }, [game_id]);

    function handleRoundClick(round_id: number) {
        router.push(`/${game_id}/${round_id}`);
    }

    return (
        <main className="p-3 flex items-center justify-center min-h-screen">
            <div className="flex flex-col gap-y-1 text-center">
                <h1 className="text-lg">
                    Available rounds for Game {game_id}:
                </h1>
                <hr className="mb-4" />
                {error && <p>{error}</p>}
                {rounds.length == 0 && <p>No rounds found.</p>}
                {rounds.length > 0 &&
                    rounds.map((round) => {
                        return (
                            <div
                                className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white p-2 mb-2 rounded"
                                role="button"
                                key={round.id}
                                onClick={() => handleRoundClick(round.id)}
                            >
                                {round.round_name}
                            </div>
                        );
                    })}
            </div>
        </main>
    );
}

export default RoundPicker;
