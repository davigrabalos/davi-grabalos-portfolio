import Navbar from "@/components/Layout/Navbar";
import CustomCursor from "@/components/UI/CustomCursor";
import { TransitionProvider } from "@/components/UI/TransitionProvider";
import "./globals.css";

export const metadata = {
  title: "Davi Grabalos | Portfolio",
  description: "Art director, and Web Developer.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Stack+Sans+Headline:wght@200..700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="edgeBlurTop" />
        <div className="edgeBlurBottom" />
        <CustomCursor />
        <TransitionProvider>
          <Navbar />
          <div id="page-transition-container" style={{ minHeight: "100vh" }}>
            {children}
          </div>
        </TransitionProvider>
      </body>
    </html>
  );
}
