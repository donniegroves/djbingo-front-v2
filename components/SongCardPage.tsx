"use client";

import CardViewer from "@/components/CardViewer";
import SongPicker from "@/components/SongPicker";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import NavBar from "./NavBar";

export default function SongCardPage() {
    const { round_id } = useParams<{
        round_id: string;
    }>();
    const [activeTab, setActiveTab] = useState<"songs" | "cards">("songs");
    const [songs, setSongs] = useState<Song[]>([]);
    const [positions, setPositions] = useState<Positions>({});
    const [roundNumber, setRoundNumber] = useState<1 | 2 | 3 | 4>(1);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchRoundData() {
            try {
                setIsLoading(true);
                const roundDataResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/r/${round_id}`
                );
                const rData: RoundDataResponse = await roundDataResponse.json();
                if (rData.isProcessingMessage) {
                    setErrorMsg(rData.isProcessingMessage);
                    return;
                } else {
                    setIsLoading(false);
                    setSongs(rData.songs);
                    setPositions(rData.positions);
                    setRoundNumber(rData.roundNumber);
                }
            } catch (e) {
                console.log(e);
                setErrorMsg("Error fetching round data.");
            }
        }

        fetchRoundData();
    }, [round_id]);

    if (errorMsg) {
        return (
            <div>
                <div
                    role="img"
                    aria-label="Loading Spinner"
                    className="spinner"
                ></div>
                <div className="error-div">{errorMsg}</div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div
                role="img"
                aria-label="Loading Spinner"
                className="spinner"
            ></div>
        );
    }

    const songPlayedStatuses: Record<number, boolean> = songs.reduce(
        (acc, song) => {
            return {
                ...acc,
                [song.id]: song.played,
            };
        },
        {}
    );

    function isWinningCard(cPattern: boolean[], round_number: 1 | 2 | 3 | 4) {
        const allWinningPatterns = {
            round1: [
                [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            ],
            round2: [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
                [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ],
            round3: [[1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1]],
            round4: [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]],
        };

        const winningPatterns = allWinningPatterns[`round${round_number}`];

        return winningPatterns.some((wPattern) => {
            return wPattern.every(
                (value, index) =>
                    (wPattern[index] === 1 && cPattern[index]) ||
                    wPattern[index] === 0
            );
        });
    }

    const winningCards: { cardId: string; playedPositions: boolean[] }[] = [];

    const finalCards = Object.keys(positions).map((cardId) => {
        const pattern = positions[cardId].map((songId) => {
            return songPlayedStatuses[songId];
        });

        if (isWinningCard(pattern, roundNumber)) {
            // setActiveTab("cards");
            winningCards.push({
                cardId,
                playedPositions: pattern,
            });
        }

        return {
            cardId,
            playedPositions: pattern,
        };
    });

    return (
        <>
            <header className="sticky top-0 z-50 bg-black">
                <NavBar
                    setActiveTab={setActiveTab}
                    winner={winningCards.length > 0}
                />
            </header>
            <main className="flex flex-col text-center p-4">
                <div>
                    {activeTab === "songs" ? (
                        <SongPicker songs={songs} setSongs={setSongs} />
                    ) : (
                        <CardViewer
                            finalCards={finalCards}
                            winningCards={winningCards}
                        />
                    )}
                </div>
            </main>
        </>
    );
}
