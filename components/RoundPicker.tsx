"use client";

import AppContext from "@/context/AppContext";
import { useParams, useRouter } from "next/navigation";
import React, { useContext } from "react";

function RoundPicker({ rounds }: { rounds: Round[] }) {
    const router = useRouter();
    const { game_id } = useParams();
    const context = useContext(AppContext);

    // test rounds
    // rounds = [
    //     {
    //         id: 1,
    //         game_id: 555,
    //         round_number: 123,
    //         round_name: "Smooth R&B",
    //     },
    //     {
    //         id: 2,
    //         game_id: 555,
    //         round_number: 124,
    //         round_name: "Country",
    //     },
    // ];

    function handleRoundClick(game_id: number, round_id: number) {
        context?.setGameId(game_id);
        context?.setCurrentRoundId(round_id);

        router.push(`/${game_id}/${round_id}`);
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center text-center p-24">
            <h1>Available rounds for game {game_id}:</h1>
            {(!rounds || rounds.length == 0) && <p>No rounds found.</p>}
            {rounds.map((round) => {
                return (
                    <div
                        role="button"
                        key={round.id}
                        onClick={() =>
                            handleRoundClick(round.game_id, round.id)
                        }
                    >
                        {round.round_name}
                    </div>
                );
            })}
        </main>
    );
}

export default RoundPicker;
