import type { Metadata } from "next";
import { Geist, Geist_Mono, Fira_Code } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import LoadingScreen from "@/components/LoadingScreen";
import AudioPlayer from "@/components/AudioPlayer";
import DevDetect from "@/components/DevDetect";
import DevProtect from "@/components/DevProtect";
import { BackgroundProvider } from "@/contexts/BackgroundContext";
import VersionDisplay from "@/components/VersionDisplay";
import VideoPreloader from "@/components/VideoPreloader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "/.xyz",
  description: "A 16-year-old discord bot developer",
  metadataBase: new URL("https://4levy.xyz"),
  authors: [{ name: "4levy" }],
  openGraph: {
    title: ".xyz | 4levy",
    description: "A 16-year-old discord bot developer",
    url: "https://4levy.xyz",
    siteName: "4levy.xyz",
    images: [
      {
        url: "https://i.postimg.cc/W3C6JT1w/480370730_611932868431109_2766177650965183363_n.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: ".xyz | 4levy",
    description: "A 16-year-old discord bot developer",
    images: [
      "https://i.postimg.cc/W3C6JT1w/480370730_611932868431109_2766177650965183363_n.jpg",
    ],
    creator: "@4levyz",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/favicon.ico",
        href: "/favicon.ico",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/favicon.ico",
        href: "/favicon.ico",
      },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    shortcut: ["/favicon.ico"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              try {
                const bypass = /./[Symbol.match];
                const check = function() {
                  if (bypass !== /./[Symbol.match]) {
                    window.location.href = '/blocked';
                  }
                };
                setInterval(check, 500);
                Object.defineProperty(/./, Symbol.match, {
                  get: () => bypass,
                  configurable: false,
                });
              } catch(e) {}
            })();
          `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${firaCode.variable} antialiased`}
      >
        <ThemeProvider>
          <VideoPreloader />
          <DevProtect />
          <LoadingScreen />
          <BackgroundProvider>
            <VersionDisplay />
            {children}
            <AudioPlayer />
          </BackgroundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
