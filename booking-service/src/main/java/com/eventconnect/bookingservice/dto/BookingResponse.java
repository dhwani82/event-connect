package com.eventconnect.bookingservice.dto;

import com.eventconnect.bookingservice.entity.Booking;
import com.eventconnect.bookingservice.entity.BookingStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record BookingResponse(
        UUID id,
        UUID eventId,
        UUID vendorId,
        UUID customerId,
        BookingStatus status,
        BigDecimal totalAmount,
        Instant createdAt
) {

    public static BookingResponse from(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getEventId(),
                booking.getVendorId(),
                booking.getCustomerId(),
                booking.getStatus(),
                booking.getTotalAmount(),
                booking.getCreatedAt()
        );
    }
}
