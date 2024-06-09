"use client";

function CardViewer({
    songs,
    songPositions,
}: {
    songs: Song[];
    songPositions: Positions;
}) {
    const songPlayedStatuses: Record<number, boolean> = songs.reduce(
        (acc, song) => {
            return {
                ...acc,
                [song.id]: song.played,
            };
        },
        {}
    );

    function isWinningCard(cPattern: boolean[], round_number: 1 | 2 | 3 | 4) {
        const allWinningPatterns = {
            round1: [
                [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            ],
            round2: [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
                [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ],
            round3: [[1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1]],
            round4: [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]],
        };

        const winningPatterns = allWinningPatterns[`round${round_number}`];

        return winningPatterns.some((wPattern) => {
            return wPattern.every(
                (value, index) =>
                    (wPattern[index] === 1 && cPattern[index]) ||
                    wPattern[index] === 0
            );
        });
    }

    const winningCards: { cardId: string; playedPositions: boolean[] }[] = [];

    const finalCards = Object.keys(songPositions).map((cardId) => {
        const pattern = songPositions[cardId].map((songId) => {
            return songPlayedStatuses[songId];
        });

        if (isWinningCard(pattern, 1)) {
            winningCards.push({
                cardId,
                playedPositions: pattern,
            });
        }

        return {
            cardId,
            playedPositions: pattern,
        };
    });

    function generateGrids(
        cards: { cardId: string; playedPositions: boolean[] }[]
    ) {
        return cards.map((fCard) => {
            return (
                <div
                    key={fCard.cardId}
                    className="card-div m-2"
                    aria-label={`Card ${fCard.cardId}`}
                >
                    <div className="text-xs">Card {fCard.cardId}</div>
                    <div className="grid grid-cols-5 w-[75px] m-auto border-r border-b border-white">
                        {fCard.playedPositions.map((played, i) => {
                            return (
                                <div
                                    key={i}
                                    className={`w-[15px] h-[15px] border-t border-l border-solid border-white ${
                                        played ? "played" : "unplayed"
                                    }`}
                                ></div>
                            );
                        })}
                    </div>
                </div>
            );
        });
    }

    const cardGrids = generateGrids(finalCards);
    const winningCardGrids = generateGrids(winningCards);

    return (
        <div>
            <h1>Card Viewer</h1>
            <p>Number of cards: {finalCards.length}</p>
            <hr />
            <div className="flex flex-row flex-wrap justify-center winners">
                {winningCardGrids}
            </div>
            <div className="flex flex-row flex-wrap justify-center">
                {cardGrids}
            </div>
        </div>
    );
}

export default CardViewer;
