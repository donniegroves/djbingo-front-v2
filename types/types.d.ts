type Round = {
    id: number;
    game_id: number;
    round_number: number;
    round_name: string;
};

type Song = {
    id: number;
};

type Card = {
    id: number;
};

type GameDataResponse = {
    isProcessing: boolean;
    cur_card_perc: number;
    rounds: Round[] | null;
    message: string;
};

type ContextType = {
    gameId: number | null;
    currentRoundId: number | null;
    rounds: Round[];
    songs: Song[];
    cards: Card[];
    setGameId: (gameId: number) => void;
    setCurrentRoundId: (roundId: number) => void;
    setRounds: (rounds: Round[]) => void;
    setSongs: (songs: Song[]) => void;
    setCards: (cards: Card[]) => void;
};
