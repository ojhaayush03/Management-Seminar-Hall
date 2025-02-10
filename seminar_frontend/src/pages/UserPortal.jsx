import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

const UserPortal = () => {
    // State to manage form inputs
    const [seminarHall, setSeminarHall] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [purpose, setPurpose] = useState("");
    const [events, setEvents] = useState([]);

    // Fetch approved events for the calendar
    useEffect(() => {
        const fetchApprovedEvents = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8080/api/requests/approved"
                );
                const eventsData = response.data.map((event) => ({
                    title: event.purpose, // Replace with the correct field name
                    date: event.requestedDateTime, // Replace with the correct field name
                }));
                setEvents(eventsData);
            } catch (error) {
                console.error("Error fetching approved events:", error);
            }
        };

        fetchApprovedEvents();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const requestData = {
            userId: 123, // Replace with actual user ID
            seminarHallId: seminarHall, // Seminar hall ID
            requestedDateTime: `${date}T${time}`, // Combine date and time
            purpose: purpose,
            status: "PENDING", // Default status
        };
    
        try {
            const response = await axios.post("http://localhost:8080/api/requests/submit", requestData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("Request submitted successfully:", response.data);
            alert("Request submitted successfully!");
        } catch (error) {
            console.error("Error submitting request:", error);
            alert("Failed to submit the request.");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>User Portal</h2>
            
            {/* Full Calendar Display */}
            <div className="calendar-container">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    height="auto"
                />
            </div>

            <div>
                <h3>Request a Seminar Hall</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Seminar Hall: 
                        <select
                            value={seminarHall}
                            onChange={(e) => setSeminarHall(e.target.value)}
                        >
                            <option value="">Select</option>
                            <option value="1">CSE</option> {/* Replace with actual IDs */}
                            <option value="2">Mechanical</option>
                            <option value="3">Civil</option>
                        </select>
                    </label>
                    <label>
                        Date: 
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </label>
                    <label>
                        Time: 
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </label>
                    <label>
                        Purpose: 
                        <input
                            type="text"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                        />
                    </label>
                    <button type="submit">Submit Request</button>
                </form>
            </div>
        </div>
    );
};

export default UserPortal;
