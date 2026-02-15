"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

interface Booking {
  id: string;
  guestName: string;
  startDate: string;
  endDate: string;
  message?: string;
  status: string;
}

interface CalendarProps {
  bookings: Booking[];
}

export default function Calendar({ bookings }: CalendarProps) {
  const calendarEvents = bookings.map(booking => ({
    id: booking.id,
    title: booking.guestName,
    start: booking.startDate,
    end: booking.endDate,
  }));

  return (
    <div className="calendar-container h-full w-full">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height="100%"
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        events={calendarEvents}
      />
    </div>
  );
}
