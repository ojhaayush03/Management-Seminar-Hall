import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { app } from "../services/firebase";

const AdminPortal = () => {
  const [requests, setRequests] = useState([]);
  const [events, setEvents] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "" });
  const [message, setMessage] = useState("");

  const db = getFirestore(app);

  // Fetch pending requests
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/requests/pending"
        );
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchPendingRequests();
  }, []);

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

  const handleRequestAction = async (id, action) => {
    try {
      // Send the action (approve/reject) to the backend
      const response = await axios.put(
        `http://localhost:8080/api/requests/${id}/status`,
        null,
        {
          params: { status: action.toUpperCase() },
        }
      );

      // Update the request list after status update
      const updatedRequests = requests.map((request) =>
        request.id === id
          ? { ...request, status: action.toUpperCase() }
          : request
      );
      setRequests(updatedRequests);
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  const handleDownloadPDF = async (requestId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/requests/${requestId}/pdf`,
        {
          responseType: 'blob',
          headers: {
            'Accept': 'application/pdf'
          }
        }
      );
      
      // Create blob from response data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create object URL
      const url = window.URL.createObjectURL(blob);
      
      // Open PDF in new tab
      window.open(url, '_blank');
      
      // Clean up the URL after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Error downloading PDF. Please try again.");
    }
  };

  // Function to add new admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      // Check if email already exists in admin collection
      const adminRef = collection(db, "admins");
      const q = query(adminRef, where("email", "==", newUser.email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setMessage("This email is already registered as an admin");
        return;
      }

      // Add new admin to Firebase
      await addDoc(collection(db, "admins"), {
        email: newUser.email,
        name: newUser.name,
        createdAt: new Date()
      });

      setMessage("Admin created successfully!");
      setNewUser({ name: "", email: "", role: "" }); // Reset form
    } catch (error) {
      console.error("Error creating admin:", error);
      setMessage("Error creating admin. Please try again.");
    }
  };

  return (
    <div className="admin-portal">
    
    <div style={{ borderTop: "1px solid white", margin: "20px 0" }}></div>

      <h1>Admin Portal</h1>
      <div style={{ borderTop: "1px solid white", margin: "20px 0" }}></div>

      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="auto"
        />
      </div>
      


      <h2>Pending Requests</h2>
      <div style={{ borderTop: "1px solid white", margin: "20px 0" }}></div>


      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Seminar Hall</th>
            <th>Date</th>
            <th>Purpose</th>
            <th>PDF</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
              <tr key={request.id}>
              <td>{request.id}</td>
              <td>{request.userId}</td>{" "}
              {/* Replace with actual user name if available */}
              <td>{request.seminarHallId}</td>{" "}
              {/* Replace with actual seminar hall name if available */}
              <td>{request.requestedDateTime}</td>
              <td>{request.purpose}</td>
              <td>
                <button
                  className="download-btn"
                  onClick={() => handleDownloadPDF(request.id)}
                  style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '8px'
                  }}
                >
                  Download PDF
                </button>
              </td>
              <td>
                {request.status === "PENDING" && (
                  <>
                    <button
                      className="accept-btn"
                      onClick={() => handleRequestAction(request.id, "APPROVED")}
                      style={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '8px'
                      }}
                    >
                      Accept
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleRequestAction(request.id, "REJECTED")}
                      style={{
                        backgroundColor: '#f44336',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Reject
                    </button>
                  </>
                )}
                {request.status !== "PENDING" && <span>{request.status}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ borderTop: "1px solid white", margin: "20px 0" }}></div>

      {/* Admin Creation Form */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Create New Admin</h2>
        {message && (
          <div className={`p-4 rounded mb-4 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleCreateAdmin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Enter name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Enter email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Create Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPortal;
