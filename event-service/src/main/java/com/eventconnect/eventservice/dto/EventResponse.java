package com.eventconnect.eventservice.dto;

import com.eventconnect.eventservice.entity.Event;
import com.eventconnect.eventservice.entity.EventStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record EventResponse(
        UUID id,
        UUID customerId,
        String title,
        String description,
        LocalDate eventDate,
        int guestCount,
        String city,
        EventStatus status,
        Instant createdAt
) {

    public static EventResponse from(Event event) {
        return new EventResponse(
                event.getId(),
                event.getCustomerId(),
                event.getTitle(),
                event.getDescription(),
                event.getEventDate(),
                event.getGuestCount(),
                event.getCity(),
                event.getStatus(),
                event.getCreatedAt()
        );
    }
}
