package com.example.seminarhall.controller;

import com.example.seminarhall.entity.SeminarHall;
import com.example.seminarhall.service.SeminarHallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/seminarhalls")
@Validated
public class SeminarHallController {

    @Autowired
    private SeminarHallService seminarHallService;

    // Health Check Endpoint
    @GetMapping("/hello")
    public String sayHello() {
        return "Hello, Seminar Hall Management System is running!";
    }

    // Fetch All Seminar Halls with Optional Pagination
    @GetMapping
    public ResponseEntity<List<SeminarHall>> getAllHalls(
            @RequestParam(value = "page", required = false, defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
        List<SeminarHall> halls = seminarHallService.getAllSeminarHalls();  //MAINE PARAMETER HATAYE HAI
        return new ResponseEntity<>(halls, HttpStatus.OK);
    }

    // Create a New Seminar Hall (Admin Only)
    @PostMapping("/register")
    public ResponseEntity<SeminarHall> createHall(@Valid @RequestBody SeminarHall hall) {
        SeminarHall createdHall = seminarHallService.createSeminarHall(hall);
        return new ResponseEntity<>(createdHall, HttpStatus.CREATED);
    }

    // Update Seminar Hall Details (Admin Only)
    @PutMapping("/update/{id}")
    public ResponseEntity<SeminarHall> updateHall(@PathVariable Long id, @Valid @RequestBody SeminarHall hall) {
        // Get the existing hall first
        //SeminarHall existingHall = seminarHallService.findById(id);


        // If the hall doesn't exist, return 404
//        if (existingHall == null) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//
//        // Update only the name and location fields
//        existingHall.setName(hall.getName());
//        existingHall.setLocation(hall.getLocation());

        // Save the updated hall
        SeminarHall updatedHall = seminarHallService.updateSeminarHall(id, hall);

        return new ResponseEntity<>(updatedHall, HttpStatus.OK);
    }


    // Delete a Seminar Hall (Admin Only)
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteHall(@PathVariable Long id) {
        seminarHallService.deleteSeminarHall(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
