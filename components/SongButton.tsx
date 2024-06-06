"use client";

import React, { useState } from "react";

function SongButton({
    song,
    setSongs,
    setErrorMsg,
}: {
    song: Song;
    setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
    setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
}): JSX.Element {
    const [played, setPlayed] = useState<boolean>(song.played);
    const [buttonError, setButtonError] = useState<string | null>(null);

    async function handleSongClick() {
        try {
            const fetchResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/toggle/${song.id}/${
                    song.played ? 0 : 1
                }`
            );
            if (!fetchResponse.ok) {
                throw await fetchResponse.text();
            }
            const responseSongJson = await fetchResponse.json();
            const responseSong: Song = responseSongJson.data;
            setPlayed(responseSong.played);

            setSongs((prevSongs) => {
                return prevSongs.map((prevSong) => {
                    if (prevSong.id === responseSong.id) {
                        return responseSong;
                    }
                    return prevSong;
                });
            });
        } catch (error) {
            setButtonError("Problem with toggling played status.");
            setErrorMsg(
                `Problem with toggling played status. ${
                    typeof error == "string" ? error : ""
                }`
            );
        }
    }

    return (
        <div
            role="button"
            onClick={() => handleSongClick()}
            className={`flex flex-col border border-gray-300 p-2 m-2${
                played ? " played" : ""
            }`}
        >
            {buttonError && <div>{buttonError}</div>}
            <div>{song.song_title}</div>
            <div>{song.artist}</div>
        </div>
    );
}

export default SongButton;
