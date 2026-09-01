import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./provider";
import { Toaster } from "sonner";
import "./globals.css";
import ConditionalNavbar from "./components/elements/ConditionalNavbar";
import ConditionalFooter from "./components/elements/ConditionalFooter";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Apeejay Institute of Management & Engineering",
  description: "Apeejay Institute of Management & Engineering Technical Campus",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-screen flex flex-col">
        <Providers>
          <ConditionalNavbar />
          <div className="flex-1">
            {children}
            <Toaster richColors position="top-right" />
          </div>
          <ConditionalFooter />
        </Providers>
      </body>
    </html>
  );
}
