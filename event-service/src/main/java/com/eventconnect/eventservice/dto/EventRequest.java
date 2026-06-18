package com.eventconnect.eventservice.dto;

import com.eventconnect.eventservice.entity.EventStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record EventRequest(
        @NotNull(message = "Customer ID is required")
        UUID customerId,

        @NotBlank(message = "Title is required")
        String title,

        @NotBlank(message = "Description is required")
        String description,

        @NotNull(message = "Event date is required")
        @Future(message = "Event date must be in the future")
        LocalDate eventDate,

        @Min(value = 1, message = "Guest count must be at least 1")
        int guestCount,

        @NotBlank(message = "City is required")
        String city
) {
}
