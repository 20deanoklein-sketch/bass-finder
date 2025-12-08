"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SubmitTournamentPage() {
  const [name, setName] = useState("");
  const [lake, setLake] = useState("");
  const [trail, setTrail] = useState("");
  const [date, setDate] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [description, setDescription] = useState("");
  
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccess(false);

    const { error } = await supabase.from("pending_submissions").insert({
      name,
      lake,
      trail,
      date,
      entry_fee: entryFee ? Number(entryFee) : null,
      description,
      state: "OK",
    });

    if (error) {
      console.error(error);
      setErrorMsg("Error submitting tournament. Try again.");
      return;
    }

    setSuccess(true);
    setName("");
    setLake("");
    setTrail("");
    setDate("");
    setEntryFee("");
    setDescription("");
  };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Submit a Tournament</h1>

      {success && (
        <p className="p-4 bg-green-500 border border-green-400 rounded mb-4">
          Tournament submitted! It will appear after approval.
        </p>
      )}

      {errorMsg && (
        <p className="p-4 bg-red-500 border border-red-400 rounded mb-4">
          {errorMsg}
        </p>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-xl">
        <input
          type="text"
          placeholder="Tournament Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Lake"
          value={lake}
          onChange={(e) => setLake(e.target.value)}
          required
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Trail"
          value={trail}
          onChange={(e) => setTrail(e.target.value)}
          required
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Entry Fee"
          value={entryFee}
          onChange={(e) => setEntryFee(e.target.value)}
          className="border p-2 rounded"
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit Tournament
        </button>
      </form>
    </main>
  );
}
