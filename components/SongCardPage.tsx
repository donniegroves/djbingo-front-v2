"use client";

import CardViewer from "@/components/CardViewer";
import SongPicker from "@/components/SongPicker";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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

    return (
        <main className="flex flex-col text-center p-4">
            <div>
                <button
                    onClick={() =>
                        setActiveTab(activeTab === "songs" ? "cards" : "songs")
                    }
                >
                    {activeTab === "songs" ? "Cards" : "Songs"}
                </button>
                {activeTab === "songs" ? (
                    <SongPicker songs={songs} setSongs={setSongs} />
                ) : (
                    <CardViewer
                        songs={songs}
                        songPositions={positions}
                        roundNumber={roundNumber}
                    />
                )}
            </div>
        </main>
    );
}
