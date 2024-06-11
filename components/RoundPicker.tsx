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
        <main className="flex flex-col text-center p-4">
            <h1>Available rounds for game {game_id}:</h1>
            {error && <p>{error}</p>}
            {rounds.length == 0 && <p>No rounds found.</p>}
            {rounds.length > 0 &&
                rounds.map((round) => {
                    return (
                        <div
                            role="button"
                            key={round.id}
                            onClick={() => handleRoundClick(round.id)}
                        >
                            {round.round_name}
                        </div>
                    );
                })}
        </main>
    );
}

export default RoundPicker;
