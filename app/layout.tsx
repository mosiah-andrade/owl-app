import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google"; // Trocado para uma fonte existente

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-alan", // Mantido o nome da variável para não quebrar seus estilos Tailwind
});

export const metadata = {
  title: "Owl - Central de Estudos",
  description: "Sua central de estudos inteligente",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#f43f5e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={plusJakartaSans.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}