"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
     supabase.auth.getUser().then(({ data }) => {
  const user = data.user;
  if (!user) {
    router.push("/login");
    return;
  }

  // Check admin role
  const role = user.user_metadata?.role;
  if (role !== "admin") {
    router.push("/dashboard"); // redirect non-admins
  }
});

    }, []);
    

  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);


  // Load pending submissions
  const loadPending = async () => {
    const { data, error } = await supabase
      .from("pending_submissions")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (!error && data) {
      setPending(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPending();
  }, []);

  // Approve submission → move to tournaments table
 const approve = async (item: any) => {
  if (actionLoading) return;
  setActionLoading(true);
  if (item.state !== "OK") {
  alert("MVP launch is Oklahoma-only.");
  setActionLoading(false);
  return;
}


  const { error: insertError } = await supabase.from("tournaments").insert({
    name: item.name?.trim(),
    lake: item.lake?.trim(),
    trail: item.trail?.trim(),
    date: item.date,
    entry_fee: item.entry_fee,
    description: item.description,
    state: item.state?.toUpperCase(),
  });

  if (insertError) {
    console.error(insertError);
    setActionLoading(false);
    return;
  }

  await supabase.from("pending_submissions").delete().eq("id", item.id);

  setActionLoading(false);
  loadPending();
};


  // Reject submission → delete row
 const reject = async (item: any) => {
  if (actionLoading) return;
  setActionLoading(true);

  await supabase.from("pending_submissions").delete().eq("id", item.id);

  setActionLoading(false);
  loadPending();
};

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin — Pending Tournaments</h1>
        <p className="text-sm text-gray-500 mb-6">
          Review submitted tournaments before publishing them publicly.
        </p>


      {pending.length === 0 ? (
        <p>No pending submissions.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pending.map((item) => (
            <div key={item.id} className="border rounded-xl p-4 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
              <p><strong>Lake:</strong> {item.lake}</p>
              <p><strong>Trail:</strong> {item.trail}</p>
              <p><strong>Date:</strong> {item.date}</p>
              <p><strong>Entry Fee:</strong> {item.entry_fee}</p>
              <p><strong>Description:</strong> {item.description}</p>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => approve(item)}
                  disabled={actionLoading}
                  className={`p-2 rounded text-white ${
                    actionLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {actionLoading ? "Processing..." : "Approve"}
                </button>


                <button
                  onClick={() => reject(item)}
                  disabled={actionLoading}
                  className={`p-2 rounded text-white ${
                    actionLoading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  Reject
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
