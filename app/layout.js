import './globals.css';
import { Curtain } from '@/components/PageTransition';

export const metadata = {
  title: 'Davi Grabalos — Software Developer, Product Engineer, UI/UX',
  description:
    'Portfolio of Davi Grabalos: software developer, product engineer and UI/UX designer building digital products end to end.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Doto:wght@100..900&family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=Orbit&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Curtain />
      </body>
    </html>
  );
}
