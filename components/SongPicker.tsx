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
    return (
        <div>
            <h1>SongPicker</h1>
            <hr></hr>
            <p>Songs in this round: {songs.length}</p>
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
