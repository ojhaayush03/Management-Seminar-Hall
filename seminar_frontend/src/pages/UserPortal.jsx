import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserPortal = () => {
    const [seminarHall, setSeminarHall] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [purpose, setPurpose] = useState("");
    const [pdfFile, setPdfFile] = useState(null);
    const [events, setEvents] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Fetch approved events for the calendar
     // Fetch approved events for the calendar
    useEffect(() => {
    const fetchApprovedEvents = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/requests/approved");
    
            const eventsData = response.data.map((event) => {
                const [year, month, day, hour, minute] = event.requestedDateTime;
                return {
                    title: event.purpose,
                    date: new Date(year, month - 1, day, hour, minute).toISOString().split("T")[0], // Adjust month
                };
            });
    
            setEvents(eventsData);
        } catch (error) {
            console.error("Error fetching approved events:", error);
        }
    };
        

        fetchApprovedEvents();
    }, []);
    
    // Handle PDF file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== "application/pdf") {
                setError("Please upload a PDF file");
                setPdfFile(null);
                return;
            }
            if (file.size > 5242880) { // 5MB in bytes
                setError("File size must be less than 5MB");
                setPdfFile(null);
                return;
            }
            setError("");
            setPdfFile(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        if (e) {
            e.preventDefault(); // Prevent form submission
        }
        
        if (!seminarHall || !date || !time || !purpose) {
            setError("Please fill all required fields");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const storedUserId = localStorage.getItem("userId");
            if (!storedUserId) {
                setError("Please log in again to submit a request");
                setIsSubmitting(false);
                navigate("/");
                return;
            }

            // Create request data
            const request = {
                userId: 123,
                seminarHallId: parseInt(seminarHall),
                requestedDateTime: `${date}T${time}:00`,
                purpose: purpose
            };

            // Create FormData instance
            const formData = new FormData();
            
            // Add the request data as 'request' key
            formData.append('request', JSON.stringify(request));
            
            // Add the file if it exists
            if (pdfFile) {
                formData.append('file', pdfFile);
            }

            console.log("Submitting form data:", {
                request,
                fileIncluded: !!pdfFile
            }); // Debug log

            // Submit the request with FormData
            const response = await axios.post("http://localhost:8080/api/requests/submit", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            if (response.status === 200 || response.status === 201) {
                // Clear form
                setSeminarHall("");
                setDate("");
                setTime("");
                setPurpose("");
                setPdfFile(null);
                setError("");
                
                // Show success message
                alert("Request submitted successfully!");
            }
        } catch (error) {
            console.error("Error submitting request:", error);
            setError(error.response?.data || "Failed to submit request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    const seminarHallMapping = {
        1: 'CSE Seminar Hall',
        2: 'Mechanical Seminar Hall',
        3: 'ISE Seminar Hall',
        4: 'IEM Seminar Hall',
        5: 'Civil Seminar Hall',
        6: 'ECE Seminar Hall',
        7: 'MCA Seminar Hall',
      };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-8"
        >
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl font-bold text-gray-900 mb-8 text-center">User Portal</h1>
                <div style={{ borderTop: "1px solid white", margin: "20px 0" }}></div>

                {/* Calendar Section */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-white rounded-xl shadow-2xl p-6 mb-8"
                >
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Event Calendar</h2>
                    <div style={{ borderTop: "1px solid white", margin: "20px 0" }}></div>

                    <div className="calendar-container">
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            events={events}
                            height="auto"
                            eventColor="#4F46E5"
                            eventTextColor="#FFFFFF"
                        />
                    </div>
                </motion.div>

                {/* Request Seminar Hall Section */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="bg-white/30 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-white/20 relative overflow-hidden"
                >
                    {/* Floating Background Animation */}
                    <div className="absolute inset-0 z-0">
                        <div className="w-64 h-64 bg-purple-300/30 rounded-full absolute -top-16 -left-16 animate-float"></div>
                        <div className="w-48 h-48 bg-blue-300/30 rounded-full absolute -bottom-16 -right-16 animate-float-reverse"></div>
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Request a Seminar Hall</h3>
                        <div style={{ borderTop: "1px solid white", margin: "20px 0" }}></div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Seminar Hall Dropdown */}
                            <div className="relative">
                                <select
                                    value={seminarHall}
                                    onChange={(e) => setSeminarHall(e.target.value)}
                                    className="w-full p-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none"
                                >
                                    <option value="">Select Seminar Hall</option>
                                    <option value="1">CSE Seminar Hall</option>
                                    <option value="2">Mechanical Seminar Hall</option>
                                    <option value="3">ISE Seminar Hall</option>
                                    <option value="4">IEM Seminar Hall</option>
                                    <option value="5">Civil Seminar Hall</option>
                                    <option value="6">ECE Seminar Hall</option>
                                    <option value="7">MCA Seminar Hall</option>
                                </select>
                            </div>

                            {/* Date Input */}
                            <div className="relative">
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full p-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                            </div>

                            {/* Time Input */}
                            <div className="relative">
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full p-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                            </div>

                            {/* Purpose Input */}
                            <div className="relative">
                                <textarea
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                    placeholder="Purpose of booking"
                                    className="w-full p-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all h-32 resize-none"
                                ></textarea>
                            </div>

                            {/* PDF File Input */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload PDF (Optional, max 5MB)
                                </label>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="w-full p-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full p-4 ${
                                    isSubmitting 
                                    ? "bg-gray-400 cursor-not-allowed" 
                                    : "bg-indigo-600 hover:bg-indigo-700"
                                } text-white font-semibold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02]`}
                            >
                                {isSubmitting ? "Submitting..." : "Submit Request"}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default UserPortal;