import { Geist, Geist_Mono } from "next/font/google";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { ToastProvider } from "../components/feedback/ToastProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pemantauan Karhutla | Sistem Informasi GIS",
  description:
    "Sistem informasi geografis untuk pemantauan kebakaran hutan dan lahan.",
  icons: {
    icon: "/karhutla-icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider>
          <Navbar />
          {children}
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
