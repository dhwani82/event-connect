package com.eventconnect.notificationservice.event;

import java.time.Instant;
import java.util.UUID;

public record BookingStatusUpdatedEvent(
        UUID bookingId,
        UUID customerId,
        BookingStatus status,
        Instant timestamp
) {
}
