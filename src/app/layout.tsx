import { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { AuthProvider } from "../components/AuthProvider";


const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EasyJobs Pakistan",
  description: "Hire Easy, Get Hired Easy",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EasyJobs",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e3a8a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${jakarta.className} bg-slate-50 flex flex-col min-h-screen`}>
        <AuthProvider>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}