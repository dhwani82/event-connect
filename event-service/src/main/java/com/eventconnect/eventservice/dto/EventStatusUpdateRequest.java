package com.eventconnect.eventservice.dto;

import com.eventconnect.eventservice.entity.EventStatus;
import jakarta.validation.constraints.NotNull;

public record EventStatusUpdateRequest(
        @NotNull(message = "Status is required")
        EventStatus status
) {
}
