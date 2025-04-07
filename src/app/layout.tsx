"use client";
//updated - april 7
import LowPolyBackground from "./components/lowpolybackground";
import "./globals.css";
import Provider from "./Provider";
import SessionTimeoutHandler from "./components/SessionTimeoutHandler/page"; // 👈 Import the timeout handler

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <html lang="en">
        <body className="relative font-nunito">
          {/* Global Session Inactivity Handler */}
          <SessionTimeoutHandler /> {/* 👈 This shows the modal if user gets logged out due to inactivity */}

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
