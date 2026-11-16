
import type { Metadata } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import LoaderProvider from "@/components/loader/LoaderProvider";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Meppeplin Decor Hub",
    template: "%s | Meppeplin Decor Hub",
  },
  description:
    "Interior décor, architectural finishes, landscaping, installations, property solutions and project management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${cormorant.variable} antialiased`}
      >
        <ThemeProvider>
          <LoaderProvider>{children}</LoaderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
