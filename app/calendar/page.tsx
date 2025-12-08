"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);

  // Load tournaments and convert them into calendar events
  const loadEvents = async () => {
    const { data, error } = await supabase
      .from("tournaments")
      .select("*");

    if (error) {
      console.error(error);
      return;
    }

    // Convert tournaments into FullCalendar event format
    const eventList = data.map((tournament) => ({
      id: tournament.id,
      title: `${tournament.lake} - ${tournament.trail}`,
      date: tournament.date, // MUST be YYYY-MM-DD
      extendedProps: {
        name: tournament.name,
        lake: tournament.lake,
        trail: tournament.trail,
        description: tournament.description,
      },
    }));

    setEvents(eventList);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Tournament Calendar</h1>

      <FullCalendar
         plugins={[dayGridPlugin]}
         initialView="dayGridMonth"
         events={events}
         height="auto"
         eventClick={(info) => {
             alert(
                 `Tournament: ${info.event.extendedProps.name}\n` +
                 `Lake: ${info.event.extendedProps.lake}\n` +
                 `Trail: ${info.event.extendedProps.trail}\n` +
                 `Description: ${info.event.extendedProps.description || "None"}`
    );
  }}
/>

    </main>
  );
}
