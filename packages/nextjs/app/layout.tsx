//import { Inter } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
// Import the ConnectKitProvider configuration (exported as ParticleConnectKit)
import { ParticleConnectkit } from "~~/components/connectkit";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

//const inter = Inter({ subsets: ["latin"] });

export const metadata = getMetadata({
  title: "PropertyBlock :: Decentralized Real Estate dApp",
  description: "Property Block Built with 🏗 Scaffold-ETH 2 and Particle Connect 2.0",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
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
