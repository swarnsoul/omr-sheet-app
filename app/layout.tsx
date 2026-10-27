import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Multigraphics Group - Sample OMR Sheet (100 Questions)",
  description: "Faithful interactive digital replica of Multigraphics Group 100-Question Sample OMR Sheet with export and save capabilities.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-[100dvh] bg-[#eaedf0] text-slate-900 antialiased selection:bg-pink-100 selection:text-pink-900 flex flex-col">
        {children}
      </body>
    </html>
  );
}
