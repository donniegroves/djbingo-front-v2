import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "./globals.css";

const barlowFont = Barlow({
    weight: ["400", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "BB",
    description: "BB will enable you to ALWAYS win!",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={barlowFont.className}>{children}</body>
        </html>
    );
}
