import { supabase } from "../lib/supabaseClient";

export default async function TournamentsPage() {
  const { data: tournaments, error } = await supabase
    .from("tournaments")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error(error);
    return <div className="p-8">Error loading tournaments.</div>;
  }

  if (!tournaments || tournaments.length === 0) {
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-4">Oklahoma Tournaments</h1>
        <p>No tournaments found. Add some in Supabase!</p>
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Oklahoma Tournaments</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tournaments.map((t) => (
          <div key={t.id} className="border rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2">{t.name}</h2>
            <p><strong>Lake:</strong> {t.lake}</p>
            <p><strong>Trail:</strong> {t.trail}</p>
            <p><strong>Date:</strong> {t.date}</p>
            <p><strong>State:</strong> {t.state}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
