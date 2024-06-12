"use client";

import { useEffect, useState } from "react";

function Settings() {
    const [resultMsg, setResultMsg] = useState<string | null>(null);
    const [maxCards, setMaxCards] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/settings`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch settings.");
                }

                const data = await response.json();

                setMaxCards(data.max_cards);
                setIsLoading(false);
            } catch (error) {
                setResultMsg("Failed to fetch settings.");
                return;
            }
        }

        fetchData();
    }, []);

    async function handleSubmit() {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/settings`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    key: "max_cards",
                    value: maxCards.toString(),
                }),
            }
        );

        if (!response.ok) {
            setResultMsg("Failed to update settings.");
            return;
        }

        setResultMsg("Settings updated successfully.");
    }

    if (isLoading) {
        return <div>{resultMsg ?? "Loading..."}</div>;
    }

    return (
        <main className="flex flex-col text-center p-4">
            {resultMsg && <p>{resultMsg}</p>}
            <div className="mb-4">
                <label className="mr-4" htmlFor="maxCards">
                    Max Cards
                </label>
                <input
                    className="p-1 w-24 text-center"
                    id="maxCards"
                    type="number"
                    value={maxCards}
                    onChange={(e) => setMaxCards(parseInt(e.target.value))}
                    max={1000}
                />
            </div>

            <button onClick={handleSubmit}>Submit</button>
        </main>
    );
}

export default Settings;
