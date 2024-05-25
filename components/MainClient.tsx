"use client";

import AppContext from "@/context/AppContext";
import { useState } from "react";

export default function MainClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const [gameId, setGameId] = useState<number | null>(null);
    const [currentRoundId, setCurrentRoundId] = useState<number | null>(null);
    const [rounds, setRounds] = useState<Round[]>([]);
    const [songs, setSongs] = useState<Song[]>([]);
    const [cards, setCards] = useState<Card[]>([]);

    const contextValue: ContextType = {
        gameId,
        setGameId,
        currentRoundId,
        setCurrentRoundId,
        rounds,
        setRounds,
        songs,
        setSongs,
        cards,
        setCards,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
}
