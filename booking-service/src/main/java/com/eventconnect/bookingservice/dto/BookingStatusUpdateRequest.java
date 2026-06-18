package com.eventconnect.bookingservice.dto;

import com.eventconnect.bookingservice.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;

public record BookingStatusUpdateRequest(
        @NotNull(message = "Status is required")
        BookingStatus status
) {
}
