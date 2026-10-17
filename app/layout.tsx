import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daybreak — Your Personal Morning Paper",
  description:
    "The stories that matter to you, gathered in one thoughtful daily read.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
