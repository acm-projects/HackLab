import '../globals.css';

export const metadata = {
    title: "Survey App",
  };
  
  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body className="bg-blue-900 text-white">{children}</body>
      </html>
    );
  }