import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const Calendar = () => {
    const events = [
    { title: "CSE Seminar", date: "2024-12-27" },
    { title: "Mechanical Seminar", date: "2024-12-28" },
    ];

    const handleDateClick = (arg) => {
    alert(`Clicked on date: ${arg.dateStr}`);
    };

    return (
    <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
    />
    );
};

export default Calendar;
