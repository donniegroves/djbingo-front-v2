"use client";

import React from "react";
import SongButton from "./SongButton";

function SongPicker({
    songs,
    setSongs,
}: {
    songs: Song[];
    setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
}) {
    const getPlayedSongsCount = () => {
        return songs.filter((song) => song.played).length;
    };

    return (
        <div>
            <p className="text-lg">
                Played songs: {getPlayedSongsCount()} / {songs.length}
            </p>
            <div className="flex flex-col items-center">
                {songs.map((song, i) => {
                    return (
                        <SongButton
                            key={song.id}
                            song={song}
                            setSongs={setSongs}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default SongPicker;
