package com.example.seminarhall.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime bookingTime;

    @ManyToOne
    @JoinColumn(name = "seminar_hall_id")
    private SeminarHall seminarHall;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
