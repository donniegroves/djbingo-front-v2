"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

function CardViewer({
    finalCards,
    winningCards,
}: {
    finalCards: CardsForViewer;
    winningCards: CardsForViewer;
}) {
    const { game_id } = useParams() as { game_id: string };

    function generateGrids(
        cards: { cardId: string; playedPositions: boolean[] }[]
    ) {
        const finalCards: {
            cardId: string;
            playedCount: number;
            playedPositions: boolean[];
        }[] = [];
        cards.map((fCard) => {
            let tempPlayedCount = 0;
            fCard.playedPositions.map((played, i) => {
                if (played) {
                    tempPlayedCount++;
                }
            });
            finalCards.push({
                cardId: fCard.cardId,
                playedCount: tempPlayedCount,
                playedPositions: fCard.playedPositions,
            });
        });

        finalCards.sort((a, b) => b.playedCount - a.playedCount);

        return finalCards.map((fCard) => {
            return (
                <Link
                    href={`${process.env.NEXT_PUBLIC_EXTERNAL_BINGO_URL}?GameID=${game_id}&CardID=Auto&GenerateCardID=${fCard.cardId}`}
                    key={fCard.cardId}
                >
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
                </Link>
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
