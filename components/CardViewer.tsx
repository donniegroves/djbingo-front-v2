"use client";

import React, { useEffect } from "react";

function CardViewer({ songs, cards }: { songs: Song[]; cards: Card[] }) {
    const songCardsDivs = cards.map((card) => {
        return (
            <div role="button" key={card.id} aria-label={`Card ${card.id}`}>
                <h4>Card {card.id}</h4>
                <div className="card-grid">card-grid here</div>
            </div>
        );
    });

    return (
        <div>
            <h1>Card Viewer</h1>
            <p>Number of songs: {songs.length}</p>
            <p>Number of cards: {cards.length}</p>
            <hr />
            {songCardsDivs}
        </div>
    );
}

export default CardViewer;
