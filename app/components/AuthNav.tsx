"use client";

import { useAuth } from "../providers";
import { supabase } from "../lib/supabaseClient";

export default function AuthNav() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/"; // redirect after logout
  };

  if (!user) {
    return (
      <a href="/login" className="hover:underline ml-auto">
        Login
      </a>
    );
  }

  return (
    <div className="flex items-center gap-4 ml-auto">
      <span className="text-sm text-gray-600">Logged in as {user.email}</span>
      <button
        onClick={handleLogout}
        className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
