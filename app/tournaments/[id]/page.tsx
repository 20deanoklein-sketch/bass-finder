"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../providers";

export default function TournamentDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadTournament = async () => {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) setTournament(data);
      setLoading(false);
    };

    loadTournament();
  }, [id]);

  const handleSave = async () => {
    if (!user) {
      alert("You must be logged in to save tournaments.");
      return;
    }

    const res = await fetch("/api/saveTournament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        tournament_id: tournament.id,
      }),
    });

    const data = await res.json();

    if (data.error) {
      alert("Already saved or error saving.");
      return;
    }

    alert("Tournament saved to your schedule!");
  };

  if (loading) {
    return <p className="p-8">Loading tournament...</p>;
  }

  if (!tournament) {
    return <p className="p-8">Tournament not found.</p>;
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">
        <a
          href="/tournaments"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back to tournaments
        </a>

      <h1 className="text-4xl font-bold mb-4">{tournament.name}</h1>

        <div className="border rounded-lg p-4 mb-6 bg-gray-800 text-white border-gray-700 shadow-sm space-y-2">
            <p><strong>Lake:</strong> {tournament.lake}</p>
            <p><strong>Trail:</strong> {tournament.trail}</p>
            <p><strong>Date:</strong> {tournament.date}</p>
            <p><strong>State:</strong> {tournament.state}</p>

         {tournament.entry_fee && (
            <p><strong>Entry Fee:</strong> ${tournament.entry_fee}</p>
        )}
        </div>
    <div className="border rounded-lg p-4 mb-6 bg-gray-800 text-white border-gray-700">
    <h2 className="text-xl font-semibold mb-2">Registration & Info</h2>

    {tournament.registration_url ? (
        <a
        href={tournament.registration_url}
        target="_blank"
        className="text-blue-600 hover:underline"
        >
        Register for this tournament
        </a>
    ) : (
        <p className="text-gray-600">
        Registration information not available yet.
        </p>
    )}

    {tournament.director_name && (
        <p className="mt-2">
        <strong>Director:</strong> {tournament.director_name}
        </p>
    )}
    </div>

    <div className="border rounded-lg p-4 mb-6 bg-gray-50">
    <h2 className="text-xl text-gray-400 font-semibold mb-2">Lake Location</h2>

    <div className="h-64 flex items-center justify-center bg-gray-200 rounded text-gray-600">
        Map view coming soon
    </div>

    <p className="text-sm text-gray-500 mt-2">
        Lake maps and ramp locations will be added in a future update.
    </p>
    </div>

<button
  onClick={handleSave}
  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg"
>
  Save to My Schedule
</button>

    </main>
  );
}
