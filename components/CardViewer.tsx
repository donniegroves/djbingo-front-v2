"use client";

function CardViewer({
    finalCards,
    winningCards,
}: {
    finalCards: CardsForViewer;
    winningCards: CardsForViewer;
}) {
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
            <p>Number of cards: {finalCards.length}</p>
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
