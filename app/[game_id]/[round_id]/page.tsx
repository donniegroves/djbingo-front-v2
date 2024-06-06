"use client";

import CardViewer from "@/components/CardViewer";
import SongPicker from "@/components/SongPicker";
import { useState } from "react";

export default function SongsAndCardsPage() {
    const [activeTab, setActiveTab] = useState<"songs" | "cards">("songs");

    if (activeTab === "songs") {
        return (
            <div>
                <button onClick={() => setActiveTab("cards")}>Cards</button>
                <SongPicker />
            </div>
        );
    }

    if (activeTab === "cards") {
        return (
            <div>
                <button onClick={() => setActiveTab("songs")}>Songs</button>
                <CardViewer />
            </div>
        );
    }
}
