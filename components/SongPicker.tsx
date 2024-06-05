"use client";

import { useParams } from "next/navigation";
import React, { useEffect } from "react";

function SongPicker() {
    const { game_id, round_id } = useParams<{
        game_id: string;
        round_id: string;
    }>();
    const [stateSongs, setStateSongs] = React.useState<Song[]>([]);
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
                    setStateSongs(rData.songs);
                }
            } catch (e) {
                console.log(e);
                setErrorMsg("Error fetching round data.");
            }
        }

        fetchRoundData();
    }, [round_id]);

    function handleSongClick(i: number) {
        try {
            fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/toggle/${
                    stateSongs[i].id
                }/${stateSongs[i].played ? 0 : 1}`
            ).catch((error) =>
                console.error("Error during toggle-play:", error)
            );
            setStateSongs((prevSongs) => {
                const newSongs = [...prevSongs];
                newSongs[i].played = !newSongs[i].played;
                return newSongs;
            });
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            setErrorMsg(
                `Problem with toggling played status. ${
                    typeof error == "string" ? error : ""
                }`
            );
        }
    }

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
                <p>useParams game_id: {game_id}</p>
                <p>useParams round_id: {round_id}</p>
                <hr></hr>
                <p>Songs in this round: {stateSongs.length}</p>
                {stateSongs.map((song, i) => {
                    return (
                        <div
                            role="button"
                            onClick={() => handleSongClick(i)}
                            key={song.id}
                            className={`flex flex-col ${
                                song.played ? " played" : ""
                            }`}
                        >
                            <div>{song.artist}</div>
                            <div>{song.song_title}</div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}

export default SongPicker;
