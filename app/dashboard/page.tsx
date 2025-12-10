"use client";

import { useAuth } from "../providers";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>You must log in to access your dashboard.</p>
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Your Dashboard</h1>

      <div className="border p-4 rounded shadow max-w-md">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.id}</p>

        <p className="text-sm text-gray-600 mt-4">
          (More features coming soon: schedules, registrations, membership levels.)
        </p>
      </div>
    </main>
  );
}
