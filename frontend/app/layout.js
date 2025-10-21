import './globals.css';
import Header from '@/components/header';

export const metadata = {
  title: 'Craft-Chain - Blockchain Traceability',
  description: 'Track handcrafted products from artisan to buyer using blockchain technology',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}