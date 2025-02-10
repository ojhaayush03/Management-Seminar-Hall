package com.example.seminarhall.controller;

import com.example.seminarhall.entity.Request;
import com.example.seminarhall.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;

    // Endpoint for users to submit a request
    @PostMapping("/submit")
    public ResponseEntity<Request> submitRequest(@RequestBody Request request) {
        return ResponseEntity.ok(requestService.saveRequest(request));
    }

    // Endpoint for admins to view pending requests
    @GetMapping("/pending")
    public ResponseEntity<List<Request>> getPendingRequests() {
        return ResponseEntity.ok(requestService.getPendingRequests());
    }

    // Endpoint for admins to approve/reject a request
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateRequestStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            // Convert status to enum and update the request
            Request.Status requestStatus = Request.Status.valueOf(status.toUpperCase());
            Request updatedRequest = requestService.updateRequestStatus(id, requestStatus);
            return ResponseEntity.ok(updatedRequest);
        } catch (IllegalArgumentException e) {
            // Handle invalid status values
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid status value: " + status + ". Valid values are ACCEPT or REJECT.");
        } catch (Exception e) {
            // Catch all other exceptions, including non-existent request ID
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating request status: " + e.getMessage());
        }
    }

    @GetMapping("/approved")
    public ResponseEntity<List<Request>> getApprovedRequests() {
        List<Request> approvedRequests = requestService.getApprovedRequests();
        return ResponseEntity.ok(approvedRequests);
    }

}
