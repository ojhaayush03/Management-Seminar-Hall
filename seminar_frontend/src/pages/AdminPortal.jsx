import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

const AdminPortal = () => {
  const [requests, setRequests] = useState([]);
  const [events, setEvents] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "" });

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

  const handleCreateUser = () => {
    // Placeholder for user creation logic
    console.log("Creating user:", newUser);
    setNewUser({ name: "", email: "", role: "" });
  };

  return (
    <div className="admin-portal">
      <h1>Admin Portal</h1>
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="auto"
        />
      </div>

      <h2>Pending Requests</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Seminar Hall</th>
            <th>Date</th>
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
              <td>
                {request.status === "PENDING" && (
                  <>
                    <button
                      className="accept-btn"
                      onClick={() =>
                        handleRequestAction(request.id, "APPROVED")
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() =>
                        handleRequestAction(request.id, "REJECTED")
                      }
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

      <h2>Create Admin</h2>
      <form
        className="create-user-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateUser();
        }}
      >
        <label>
          Name:
          <input
            type="text"
            value={newUser.name}
            onChange={(e) =>
              setNewUser((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </label>
        <label>
          Role:
          <select
            value={newUser.role}
            onChange={(e) =>
              setNewUser((prev) => ({ ...prev, role: e.target.value }))
            }
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </label>
        <button type="submit" className="submit-btn">
          Create User
        </button>
      </form>
    </div>
  );
};

export default AdminPortal;
