package com.eventconnect.bookingservice.event;

import com.eventconnect.bookingservice.entity.BookingStatus;

import java.time.Instant;
import java.util.UUID;

public record BookingStatusUpdatedEvent(
        UUID bookingId,
        UUID customerId,
        BookingStatus status,
        Instant timestamp
) {
}
