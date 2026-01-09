"use client";

import { useEffect, useState } from "react";
// Use the import path that works in your project:
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../providers";

export default function TournamentsPage() {
  const { user } = useAuth();

  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [lake, setLake] = useState("");
  const [trail, setTrail] = useState("");
  const [date, setDate] = useState("");
  // Dropdown options (Day 15)
  const [lakes, setLakes] = useState<string[]>([]);
  const [trails, setTrails] = useState<string[]>([]);

  // Fetch tournaments with filters (Day 5 logic)
  const fetchTournaments = async () => {
    setLoading(true);

    let query = supabase
      .from("tournaments")
      .select("*")
      .order("date", { ascending: true });

    if (lake) query = query.eq("lake", lake);
    if (trail) query = query.eq("trail", trail);
    if (date) query = query.eq("date", date);

    const { data, error } = await query;

    if (!error && data) setTournaments(data);
    setLoading(false);
  };
  // Load dropdown options (Day 15)
  const loadFilterOptions = async () => {
    const { data, error } = await supabase
      .from("tournaments")
      .select("lake, trail");

    if (error || !data) return;

    const uniqueLakes = Array.from(new Set(data.map((d: any) => d.lake)))
      .filter(Boolean)
      .sort();

    const uniqueTrails = Array.from(new Set(data.map((d: any) => d.trail)))
      .filter(Boolean)
      .sort();

    setLakes(uniqueLakes);
    setTrails(uniqueTrails);
  };

  useEffect(() => {
    fetchTournaments();
  }, [lake, trail, date]);
  useEffect(() => {
    loadFilterOptions();
  }, []);

  // ⭐ Save to Schedule (Day 12 logic)
  const handleSave = async (tournamentId: string) => {
    if (!user) {
      alert("You must be logged in to save tournaments.");
      return;
    }

    const res = await fetch("/api/saveTournament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        tournament_id: tournamentId,
      }),
    });

    const data = await res.json();

    if (data.error) {
      alert("Already saved or error saving.");
      return;
    }

    alert("Tournament saved to your schedule!");
  };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Oklahoma Tournaments</h1>

      {/* Filters row (Day 5) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select
          value={lake}
          onChange={(e) => setLake(e.target.value)}
          className="border p-2 rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Lakes</option>
          {lakes.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>


        <select
          value={trail}
          onChange={(e) => setTrail(e.target.value)}
          className="border p-2 rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Trails</option>
          {trails.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>


        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={() => {
            setLake("");
            setTrail("");
            setDate("");
          }}
          className="border p-2 rounded bg-gray-400 hover:bg-gray-300"
        >
          Reset Filters
        </button>
      </div>

      {/* Loading / empty states */}
      {loading && <p>Loading tournaments...</p>}
      {!loading && tournaments.length === 0 && (
        <p>No tournaments match your filters.</p>
      )}

      {/* Tournament cards + Save button */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tournaments.map((t) => (
          <div
            key={t.id}
            className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold mb-2">
              <a
                  href={`/tournaments/${t.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {t.name}
             </a>
            </h2>

            <p>
              <strong>Lake:</strong> {t.lake}
            </p>
            <p>
              <strong>Trail:</strong> {t.trail}
            </p>
            <p>
              <strong>Date:</strong> {t.date}
            </p>
            <p>
              <strong>State:</strong> {t.state}
            </p>

            <button
              onClick={() => handleSave(t.id)}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save to Schedule
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
