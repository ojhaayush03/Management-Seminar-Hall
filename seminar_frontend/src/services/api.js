import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api",
});

export const fetchSeminarRequests = () => API.get("/seminar-requests");
export const submitSeminarRequest = (data) => API.post("/seminar-requests", data);

export default API;
