//package com.example.seminarhall.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
////import com.example.seminarhall.service.EmailService;
//
//@RestController
//public class TestController {
//
//
//    @GetMapping("/api/test/email")
//    public ResponseEntity<String> testEmail(@RequestParam String toEmail) {
//        try {
//            emailService.sendStatusUpdateEmail(
//                toEmail,
//                "TEST",
//                "Test Hall",
//                "2025-02-17"
//            );
//            return ResponseEntity.ok("Test email sent successfully!");
//        } catch (Exception e) {
//            return ResponseEntity.internalServerError()
//                .body("Failed to send email: " + e.getMessage());
//        }
//    }
//}
