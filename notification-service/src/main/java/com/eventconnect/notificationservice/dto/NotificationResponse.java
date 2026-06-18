package com.eventconnect.notificationservice.dto;

import com.eventconnect.notificationservice.entity.Notification;
import com.eventconnect.notificationservice.entity.NotificationType;

import java.time.Instant;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        UUID bookingId,
        UUID customerId,
        String message,
        NotificationType type,
        Instant sentAt
) {

    public static NotificationResponse from(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getBookingId(),
                notification.getCustomerId(),
                notification.getMessage(),
                notification.getType(),
                notification.getSentAt()
        );
    }
}
