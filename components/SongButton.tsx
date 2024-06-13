"use client";

import { useState } from "react";

function SongButton({
    song,
    setSongs,
}: {
    song: Song;
    setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
}): JSX.Element {
    const [played, setPlayed] = useState<boolean>(song.played);
    const [buttonError, setButtonError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handleSongClick() {
        try {
            setIsLoading(true);
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
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setButtonError("Problem with toggling played status.");
        }
    }

    if (isLoading) {
        return (
            <div
                role="button"
                className={`flex flex-col border border-gray-300 w-[350px] p-2 m-2${
                    played ? " played" : ""
                }`}
            >
                <div
                    role="img"
                    aria-label="Loading Spinner"
                    className="spinner m-auto"
                ></div>
            </div>
        );
    }

    return (
        <div
            role="button"
            onClick={() => handleSongClick()}
            className={`flex flex-col border border-gray-300 w-[350px] p-2 m-2${
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
