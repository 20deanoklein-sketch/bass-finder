import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabaseClient"; // your working path

export async function POST(req: Request) {
  console.log("🔥 API route hit");

  const body = await req.json();
  const { user_id, tournament_id } = body;

  console.log("User:", user_id);
  console.log("Tournament:", tournament_id);

  if (!user_id || !tournament_id) {
    console.log("❌ Missing fields");
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Check duplicate
  const { data: existing, error: existingError } = await supabase
    .from("user_schedules")
    .select("*")
    .eq("user_id", user_id)
    .eq("tournament_id", tournament_id);

  console.log("Existing result:", existing);
  console.log("Existing error:", existingError);

  if (existingError) {
    console.log("❌ Duplicate check error:", existingError);
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  if (existing && existing.length > 0) {
    console.log("⚠️ Already saved");
    return NextResponse.json({ error: "Already saved" }, { status: 400 });
  }

  // Insert
  const { error: insertError } = await supabase
    .from("user_schedules")
    .insert({
      user_id,
      tournament_id,
    });

  if (insertError) {
    console.log("❌ Insert error:", insertError);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  console.log("✅ Successfully saved");
  return NextResponse.json({ success: true });
}
