import React from "react";

const initialContext = {
    gameId: null,
    currentRoundId: null,
    rounds: [],
    songs: [],
    cards: [],
    setGameId: (gameId: number) => {},
    setCurrentRoundId: (roundId: number) => {},
    setRounds: (rounds: Round[]) => {},
    setSongs: (songs: Song[]) => {},
    setCards: (cards: Card[]) => {},
};

const AppContext = React.createContext<ContextType>(initialContext);

export default AppContext;
