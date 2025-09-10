import { Poppins } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { NotificationProvider } from "../context/NotificationContext";
import { NavBar } from "../components/NavBar";
import { ClientRouteLoadingOverlay } from "../components/RouteLoadingOverlay";
import { ThemeBackground } from "../components/ThemeBackground";
import { Footer } from "../components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300","400","500","600","700"],
});

export const metadata = {
  title: "Ballotguard - Secure Voting Platform",
  description: "Create elections, invite voters, and view results securely.",
  icons: {
    icon: '/icon.svg'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
  <body className={`${poppins.className} antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider>
            <NotificationProvider>
            <ThemeBackground>
              <div className="min-h-screen flex flex-col">
                <NavBar />
                <Suspense fallback={null}>
                  <ClientRouteLoadingOverlay />
                </Suspense>
                <main className="max-w-5xl mx-auto px-4 pt-24 pb-8 flex-1 w-full">{children}</main>
                <Footer />
              </div>
            </ThemeBackground>
            </NotificationProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
