import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { GraduationCap, School, User, Trophy } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admission Tracker - Track Your College Journey",
  description: "Track your college applications, compete with peers, and help schools find you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <GraduationCap className="h-8 w-8 text-indigo-600" />
                  <span className="text-xl font-bold text-gray-900">Admission Tracker</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/leaderboard" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                  <Trophy className="h-5 w-5" />
                  <span>Leaderboard</span>
                </Link>
                <Link href="/student" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                  <User className="h-5 w-5" />
                  <span>Student</span>
                </Link>
                <Link href="/school" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                  <School className="h-5 w-5" />
                  <span>School</span>
                </Link>
                <Link
                  href="/auth/login"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
