package com.eventconnect.vendorservice.dto;

import com.eventconnect.vendorservice.entity.Category;
import com.eventconnect.vendorservice.entity.Vendor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record VendorResponse(
        UUID id,
        UUID userId,
        String businessName,
        Category category,
        String description,
        String city,
        BigDecimal pricePerHour,
        boolean available,
        Instant createdAt
) {

    public static VendorResponse from(Vendor vendor) {
        return new VendorResponse(
                vendor.getId(),
                vendor.getUserId(),
                vendor.getBusinessName(),
                vendor.getCategory(),
                vendor.getDescription(),
                vendor.getCity(),
                vendor.getPricePerHour(),
                vendor.isAvailable(),
                vendor.getCreatedAt()
        );
    }
}
