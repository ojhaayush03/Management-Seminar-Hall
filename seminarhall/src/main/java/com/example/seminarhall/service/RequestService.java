package com.example.seminarhall.service;

import com.example.seminarhall.entity.Request;
import com.example.seminarhall.repository.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequestService {
    @Autowired
    private RequestRepository requestRepository;

    public Request saveRequest(Request request) {
        return requestRepository.save(request);
    }

    public List<Request> getPendingRequests() {
        return requestRepository.findByStatus(Request.Status.PENDING);
    }

    public Request updateRequestStatus(Long requestId, Request.Status status) {
        Request request = requestRepository.findById(requestId).orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(status);
        return requestRepository.save(request);
    }

    public List<Request> getApprovedRequests() {
        return requestRepository.findByStatus(Request.Status.APPROVED);
    }

    public Request getRequestById(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + id));
    }

    public List<Request> getRejectedRequests() {
        return requestRepository.findByStatus(Request.Status.REJECTED);
    }
}
