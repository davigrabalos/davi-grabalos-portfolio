import Navbar from "@/components/Layout/Navbar";
import CustomCursor from "@/components/UI/CustomCursor";
import { TransitionProvider } from "@/components/UI/TransitionProvider";
import "./globals.css";

export const metadata = {
  title: "Davi Grabalos | Art Director & Web Developer",
  description:
    "Portfolio of Davi Grabalos — Art Director and Creative Web Developer crafting high-end digital experiences, visual identities, and interactive storytelling.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Davi Grabalos | Art Director & Web Developer",
    description:
      "High-end digital experiences, visual identities, and interactive storytelling.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Stack+Sans+Headline:wght@200..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CustomCursor />
        <TransitionProvider>
          <Navbar />
          <div id="page-root">
            {children}
          </div>
        </TransitionProvider>
      </body>
    </html>
  );
}
