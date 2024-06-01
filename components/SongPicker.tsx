"use client";

import AppContext from "@/context/AppContext";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useContext, useEffect } from "react";

function SongPicker() {
    const params = useParams<{ game_id: string; round_id: string }>();
    const game_id = parseInt(params.game_id);
    const round_id = parseInt(params.round_id);
    const context = useContext(AppContext);
    const [songs, setSongs] = React.useState<Song[]>([]);
    const [errorMsg, setErrorMsg] = React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    useEffect(() => {
        async function fetchRoundData() {
            try {
                const roundDataResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/${game_id}/${round_id}`
                );

                const rData: RoundDataResponse = await roundDataResponse.json();

                if (rData.isProcessingMessage) {
                    setErrorMsg(rData.isProcessingMessage);
                    setIsLoading(true);
                    return;
                } else {
                    setIsLoading(false);
                    context?.setSongs(rData.songs);
                    setSongs(rData.songs);
                    context?.setCards(rData.cards);
                }
            } catch (e) {
                console.log(e);
                setErrorMsg(
                    `Error fetching round data. ${
                        typeof e == "string" ? e : ""
                    }`
                );
            }
        }

        fetchRoundData();
    }, [game_id, round_id, context]);

    function handleSongClick(i: number) {
        try {
            fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/toggle/${songs[i].id}/${
                    songs[i].played ? 0 : 1
                }`
            ).catch((error) =>
                console.error("Error during toggle-play:", error)
            );
            setSongs((prevSongs) => {
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
                <Image
                    src="https://REPLACETHIS.COM/IMAGE.JPG"
                    alt="Loading Spinner"
                    width="50"
                    height="50"
                />
            )}
            {errorMsg && <div className="error-div">{errorMsg}</div>}
            <div>
                <h1>SongPicker</h1>
                <p>useParams game_id: {game_id}</p>
                <p>useParams round_id: {round_id}</p>
                <hr></hr>
                <p>Songs in this round: {songs.length}</p>
                {songs.map((song, i) => {
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
