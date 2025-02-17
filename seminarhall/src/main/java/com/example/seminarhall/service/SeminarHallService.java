package com.example.seminarhall.service;

import com.example.seminarhall.entity.SeminarHall;
import com.example.seminarhall.repository.SeminarHallRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeminarHallService {
    @Autowired
    private SeminarHallRepository seminarHallRepository;

    public List<SeminarHall> getAllSeminarHalls() {
        return seminarHallRepository.findAll();
    }

    // Method to update an existing seminar hall
    public SeminarHall updateSeminarHall(Long id, SeminarHall hallDetails) {
        // Find the seminar hall by ID
        Optional<SeminarHall> seminarHall = seminarHallRepository.findById(id);

        if(seminarHall.isPresent()) {
            SeminarHall existingHall = seminarHall.get();

            // Update the details
            existingHall.setName(hallDetails.getName());
            existingHall.setLocation(hallDetails.getLocation());
            existingHall.setCapacity(hallDetails.getCapacity());
            // Add other fields that need to be updated

            // Save the updated hall
            return seminarHallRepository.save(existingHall);
        } else {
            // If seminar hall not found, return null or handle this case accordingly
            return null; // Or throw an exception
        }
    }

    public SeminarHall createSeminarHall(SeminarHall hall) {
        return seminarHallRepository.save(hall);
    }

    public void deleteSeminarHall(Long id) {
        seminarHallRepository.deleteById(id);
    }


}
