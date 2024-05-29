"use client";

import SongPicker from "@/components/SongPicker";
import { useState } from "react";

export default function SongsAndCardsPage() {
    const [activeTab, setActiveTab] = useState("songs");

    if (activeTab === "songs") {
        return <SongPicker />;
    }

    if (activeTab === "cards") {
        <div>Cards Picker</div>;
        // return <CardsPicker />;
    }
}
