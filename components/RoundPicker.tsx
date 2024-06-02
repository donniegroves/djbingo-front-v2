"use client";

import AppContext from "@/context/AppContext";
import { useParams, useRouter } from "next/navigation";
import React, { useContext } from "react";

function RoundPicker() {
    const router = useRouter();
    const { game_id } = useParams() as { game_id: string };
    const context = useContext(AppContext);

    function handleRoundClick(round_id: number) {
        context?.setGameId(parseInt(game_id));
        context?.setCurrentRoundId(round_id);

        router.push(`/${game_id}/${round_id}`);
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center text-center p-24">
            <h1>Available rounds for game {game_id}:</h1>
            {(!context?.rounds || context.rounds.length == 0) && (
                <p>No rounds found.</p>
            )}
            {context?.rounds &&
                context.rounds.map((round) => {
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
