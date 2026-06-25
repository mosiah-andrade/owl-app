import type { Metadata } from "next";
import "./globals.css";
import { Alan_Sans } from "next/font/google";

const alanSans = Alan_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-alan", 
});

export const metadata = {
  title: "Owl - Central de Estudos",
  description: "Sua central de estudos inteligente",
  manifest: "/manifest.json", // Adicione esta linha aqui
};

// Se o aviso do viewport que vimos no console persistir, aproveite para adicionar:
export const viewport = {
  themeColor: "#f43f5e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Evita que o usuário dê zoom sem querer no mobile, parecendo mais nativo
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={alanSans.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}