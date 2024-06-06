"use client";

import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import SongButton from "./SongButton";

function SongPicker() {
    const { round_id } = useParams<{
        round_id: string;
    }>();
    const [songs, setSongs] = React.useState<Song[]>([]);
    const [errorMsg, setErrorMsg] = React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    useEffect(() => {
        async function fetchRoundData() {
            try {
                const roundDataResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/r/${round_id}`
                );
                const rData: RoundDataResponse = await roundDataResponse.json();

                if (rData.isProcessingMessage) {
                    setErrorMsg(rData.isProcessingMessage);
                    setIsLoading(true);
                    return;
                } else {
                    setIsLoading(false);
                    setSongs(rData.songs);
                }
            } catch (e) {
                console.log(e);
                setErrorMsg("Error fetching round data.");
            }
        }

        fetchRoundData();
    }, [round_id]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center text-center p-24">
            {isLoading && (
                <div
                    role="img"
                    aria-label="Loading Spinner"
                    className="spinner"
                ></div>
            )}
            {errorMsg && <div className="error-div">{errorMsg}</div>}
            <div>
                <h1>SongPicker</h1>
                <hr></hr>
                <p>Songs in this round: {songs.length}</p>
                {songs.map((song, i) => {
                    return (
                        <SongButton
                            key={song.id}
                            song={song}
                            setSongs={setSongs}
                            setErrorMsg={setErrorMsg}
                        />
                    );
                })}
            </div>
        </main>
    );
}

export default SongPicker;
