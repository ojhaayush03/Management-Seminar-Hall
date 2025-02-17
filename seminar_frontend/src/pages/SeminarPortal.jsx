import React, { useState, useEffect } from "react";

// Assuming you have a backend API to fetch, create, update, and delete seminar halls.
const SeminarPortal = () => {
  const [seminarHalls, setSeminarHalls] = useState([]);
  const [newSeminarHall, setNewSeminarHall] = useState({
    name: "",
    location: "",
  });
  const [editingSeminarHall, setEditingSeminarHall] = useState(null);

  useEffect(() => {
    // Fetch seminar halls from API on page load
    fetchSeminarHalls();
  }, []);

  // Function to fetch seminar halls from the backend
  const fetchSeminarHalls = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/seminarhalls"); // Adjust API endpoint accordingly
      const data = await response.json();
      setSeminarHalls(data);
    } catch (error) {
      console.error("Error fetching seminar halls:", error);
    }
  };

  // Function to create a new seminar hall
  const createSeminarHall = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/seminarhalls/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: `{
          "name": "${newSeminarHall.name}",
          "location": "${newSeminarHall.location}"
        }`,
      });
      if (response.ok) {
        fetchSeminarHalls();
        setNewSeminarHall({ name: "", location: "" }); // Reset the form
      }
    } catch (error) {
      console.error("Error creating seminar hall:", error);
    }
  };

  // Function to update an existing seminar hall
  const updateSeminarHall = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/seminarhalls/update/${editingSeminarHall.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: `{
          "name": "${editingSeminarHall.name}",
          "location": "${editingSeminarHall.location}"
        }`,
      });
      if (response.ok) {
        fetchSeminarHalls();
        setEditingSeminarHall(null); // Clear the form
      }
    } catch (error) {
      console.error("Error updating seminar hall:", error);
    }
  };

  // Function to delete a seminar hall
  const deleteSeminarHall = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/seminarhalls/delete/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchSeminarHalls();
      }
    } catch (error) {
      console.error("Error deleting seminar hall:", error);
    }
  };

  return (
    <div className="seminar-portal">
      <h1>Manage Seminar Halls</h1>

      
      
      {/* Create or Edit Form */}
      <div className="form-container">
        <h2>{editingSeminarHall ? "Update Seminar Hall" : "Create New Seminar Hall"}</h2>
        <form onSubmit={editingSeminarHall ? updateSeminarHall : createSeminarHall}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={editingSeminarHall ? editingSeminarHall.name : newSeminarHall.name}
              onChange={(e) =>
                editingSeminarHall
                  ? setEditingSeminarHall({ ...editingSeminarHall, name: e.target.value })
                  : setNewSeminarHall({ ...newSeminarHall, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Location:</label>
            <input
              type="text"
              value={editingSeminarHall ? editingSeminarHall.location : newSeminarHall.location}
              onChange={(e) =>
                editingSeminarHall
                  ? setEditingSeminarHall({ ...editingSeminarHall, location: e.target.value })
                  : setNewSeminarHall({ ...newSeminarHall, location: e.target.value })
              }
              required
            />
          </div>
          <button type="submit">{editingSeminarHall ? "Update" : "Create"}</button>
        </form>
      </div>

      {/* Displaying Seminar Halls */}
      <div className="seminar-hall-list">
        <h2>Seminar Halls</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {seminarHalls.map((hall) => (
              <tr key={hall.id}>
                <td>{hall.name}</td>
                <td>{hall.location}</td>
                <td>
                  <button onClick={() => setEditingSeminarHall(hall)}>Edit</button>
                  <button onClick={() => deleteSeminarHall(hall.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    
  );
};

export default SeminarPortal;
