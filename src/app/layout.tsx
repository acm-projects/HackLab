import LowPolyBackground from "./lowpolybackground";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative">
        <LowPolyBackground />
        <div className="relative z-10">{children}</div> {/* Keeps content above canvas */}
      </body>
    </html>
  );
}
