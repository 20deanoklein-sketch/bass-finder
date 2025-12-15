"use client";

import { useAuth } from "../providers";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient"; // or your working relative path

export default function SchedulePage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const { data, error } = await supabase
        .from("user_schedules")
        .select("id, tournament_id, tournaments(*)")
        .eq("user_id", user.id);

      if (!error) setItems(data);
    };

    load();
  }, [user]);

  if (!user) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">My Schedule</h1>
        <p>You must log in to view your schedule.</p>
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Tournament Schedule</h1>

      {items.length === 0 && <p>No tournaments saved yet.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item.id} className="border rounded p-4 shadow-sm">
            <h2 className="text-xl font-semibold">{item.tournaments.name}</h2>
            <p><strong>Lake:</strong> {item.tournaments.lake}</p>
            <p><strong>Trail:</strong> {item.tournaments.trail}</p>
            <p><strong>Date:</strong> {item.tournaments.date}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
