import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { NotificationProvider } from "../context/NotificationContext";
import { NavBar } from "../components/NavBar";
import { ClientRouteLoadingOverlay } from "../components/RouteLoadingOverlay";
import { ThemeBackground } from "../components/ThemeBackground";
import { Footer } from "../components/Footer";
import { PageContainer } from "../components/PageContainer";
import { GoogleOAuthProvider } from "@react-oauth/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Ballotguard - Secure Voting Platform",
  description: "Cryptographically verifiable election platform for modern organizations.",
  icons: {
    icon: '/logo.png'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-canvas text-ink`} suppressHydrationWarning>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <AuthProvider>
            <ThemeProvider>
              <NotificationProvider>
                <ThemeBackground>
                  <div className="min-h-screen flex flex-col">
                    <NavBar />
                    <Suspense fallback={null}>
                      <ClientRouteLoadingOverlay />
                    </Suspense>
                    <main className="flex-1 w-full flex flex-col">
                      <PageContainer>{children}</PageContainer>
                    </main>
                    <Footer />
                  </div>
                </ThemeBackground>
              </NotificationProvider>
            </ThemeProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
