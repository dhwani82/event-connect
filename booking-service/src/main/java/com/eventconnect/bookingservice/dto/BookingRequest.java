package com.eventconnect.bookingservice.dto;

import com.eventconnect.bookingservice.entity.BookingStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record BookingRequest(
        @NotNull(message = "Event ID is required")
        UUID eventId,

        @NotNull(message = "Vendor ID is required")
        UUID vendorId,

        @NotNull(message = "Customer ID is required")
        UUID customerId,

        @NotNull(message = "Total amount is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Total amount must be greater than zero")
        BigDecimal totalAmount
) {
}
