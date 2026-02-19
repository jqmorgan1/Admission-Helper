import Link from "next/link";
import { Trophy, TrendingUp, Users, Building2, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Track Your College Journey
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Manage your applications, compete with peers, and let schools discover you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup?role=student"
                className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
              >
                I'm a Student <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/auth/signup?role=school"
                className="bg-indigo-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-900 transition-colors flex items-center justify-center gap-2"
              >
                I'm a School <Building2 className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Competition Leaderboard</h3>
              <p className="text-gray-600">
                See how you're progressing compared to other applicants. Push yourself to submit faster and complete more tasks.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Track every task from essays to recommendations. Never miss a deadline with our smart reminders.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Results Feed</h3>
              <p className="text-gray-600">
                Share your acceptances and rejections anonymously. Help others understand their chances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Schools Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">For Schools</h2>
                <p className="text-gray-600 mb-6">
                  Discover talented students before they apply. Track their academic journey over three years and build relationships early.
                </p>
                <ul className="space-y-3">
                  {[
                    "Search and filter potential applicants",
                    "Track student progress over time",
                    "Reduce screening workload",
                    "Connect with students directly",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Start Free Trial</h3>
                <p className="text-indigo-100 mb-6">
                  Try all features free for 30 days. No credit card required.
                </p>
                <Link
                  href="/auth/signup?role=school"
                  className="block w-full bg-white text-indigo-600 text-center py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Admission Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
