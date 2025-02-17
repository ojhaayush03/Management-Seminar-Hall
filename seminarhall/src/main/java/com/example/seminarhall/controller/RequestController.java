package com.example.seminarhall.controller;

import com.example.seminarhall.entity.Request;
import com.example.seminarhall.service.FileStorageService;
import com.example.seminarhall.service.RequestService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/submit")
    public ResponseEntity<?> submitRequest(
            @RequestParam("request") String requestJson,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            // Parse the request JSON
            Request request = objectMapper.readValue(requestJson, Request.class);
            
            // Handle file upload if present
            if (file != null && !file.isEmpty()) {
                String fileName = fileStorageService.storeFile(file);
                request.setPdfPath(fileName);
            }

            Request savedRequest = requestService.saveRequest(request);
            return ResponseEntity.ok(savedRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error submitting request: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<Resource> downloadPdf(@PathVariable Long id) {
        try {
            Request request = requestService.getRequestById(id);
            if (request.getPdfPath() == null) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = fileStorageService.loadFileAsResource(request.getPdfPath());
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Request>> getPendingRequests() {
        return ResponseEntity.ok(requestService.getPendingRequests());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateRequestStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            Request.Status requestStatus = Request.Status.valueOf(status.toUpperCase());
            Request updatedRequest = requestService.updateRequestStatus(id, requestStatus);
            return ResponseEntity.ok(updatedRequest);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body("Invalid status value: " + status + ". Valid values are APPROVED or REJECTED");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error updating request status: " + e.getMessage());
        }
    }

    @GetMapping("/approved")
    public ResponseEntity<List<Request>> getApprovedRequests() {
        return ResponseEntity.ok(requestService.getApprovedRequests());
    }

    @GetMapping("/rejected")
    public ResponseEntity<List<Request>> getRejectedRequests() {
        return ResponseEntity.ok(requestService.getRejectedRequests());
    }
}
