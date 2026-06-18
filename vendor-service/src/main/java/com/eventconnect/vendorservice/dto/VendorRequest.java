package com.eventconnect.vendorservice.dto;

import com.eventconnect.vendorservice.entity.Category;
import com.eventconnect.vendorservice.entity.Vendor;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record VendorRequest(
        @NotNull(message = "User ID is required")
        UUID userId,

        @NotBlank(message = "Business name is required")
        String businessName,

        @NotNull(message = "Category is required")
        Category category,

        @NotBlank(message = "Description is required")
        String description,

        @NotBlank(message = "City is required")
        String city,

        @NotNull(message = "Price per hour is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Price per hour must be greater than zero")
        BigDecimal pricePerHour
) {
}
