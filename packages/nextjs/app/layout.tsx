import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";
import { Inter } from 'next/font/google';

// Import the ConnectKitProvider configuration (exported as ParticleConnectKit)
import { ParticleConnectkit } from '~~/components/connectkit';

const inter = Inter({ subsets: ['latin'] });

export const metadata = getMetadata({
  title: "Scaffold-ETH 2 App",
  description: "Property Block Built with 🏗 Scaffold-ETH 2 and Particle Connect 2.0",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider enableSystem>
          <ParticleConnectkit>
            <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
          </ParticleConnectkit>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
