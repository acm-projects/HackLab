"use client";
import LowPolyBackground from "./components/lowpolybackground";
import "./globals.css";
import Provider from "./Provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <html lang="en">
        <body className="relative font-nunito">
          {/* Background (Stays on all pages) */}
          <LowPolyBackground />

          {/* Load the current page here */}
          <div className="relative z-10">
            {children}
          </div>
        </body>
      </html>
    </Provider>
  );
}
