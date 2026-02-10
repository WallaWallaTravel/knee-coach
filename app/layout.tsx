import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { ThemeProvider } from "@/lib/theme/theme-provider";

export const metadata: Metadata = {
  title: "Body Coach",
  description: "Your personal rehabilitation companion",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0c" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// Inline script that runs before first paint to prevent FOUC.
// Reads the user's saved theme from localStorage and sets data-theme immediately.
const themeScript = `(function(){try{var s=JSON.parse(localStorage.getItem("bodyCoach.settings.app"));var t=s&&s.theme||"system";var r=t;if(t==="system"){r=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",r)}catch(e){document.documentElement.setAttribute("data-theme",window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:rounded-lg focus:m-2"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <div id="main-content">
          {children}
          </div>
        </ThemeProvider>
        <Script id="sw-register" strategy="afterInteractive">
          {`if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js'))}`}
        </Script>
      </body>
    </html>
  );
}
