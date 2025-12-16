import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 1. Import the AuthProvider
import { AuthProvider } from "@/contexts/AuthContext"; 

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import AppChrome from "@/components/AppChrome";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "EduConnectPortal", // Updated Title
    description: "Portal for Teachers and Parents.", // Updated Description
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {/* 2. Place AuthProvider here to wrap the entire main application structure */}
                <AuthProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {/* AppChrome hides chrome on /login and /signup */}
                        <AppChrome>{children}</AppChrome>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}