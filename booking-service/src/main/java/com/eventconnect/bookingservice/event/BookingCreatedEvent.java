package com.eventconnect.bookingservice.event;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record BookingCreatedEvent(
        UUID bookingId,
        UUID eventId,
        UUID vendorId,
        UUID customerId,
        BigDecimal totalAmount,
        Instant timestamp
) {
}
