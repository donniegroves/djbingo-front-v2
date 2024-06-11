type Round = {
    id: number;
    round_number: number;
    round_name: string;
};

type Song = {
    id: number;
    round_id: number;
    artist: string;
    song_title: string;
    played: boolean;
};

type Card = {
    id: number;
    ext_card_id: number;
    round_id: number;
};

type CardsForViewer = {
    cardId: string;
    playedPositions: boolean[];
}[];

type Positions = { [key: string]: number[] };

type GameDataResponse = {
    isProcessingMessage: string | null;
    cur_card_perc: number;
    rounds: Round[];
};

type RoundDataResponse = {
    isProcessingMessage: string | null;
    songs: Song[];
    positions: Positions;
    roundNumber: 1 | 2 | 3 | 4;
};

type ContextType = {
    gameId: number | null;
    currentRoundId: number | null;
    rounds: Round[];
    songs: Song[];
    setGameId: (gameId: number) => void;
    setCurrentRoundId: (roundId: number) => void;
    setRounds: (rounds: Round[]) => void;
    setSongs: (songs: Song[]) => void;
    setCards: (cards: Card[]) => void;
};
