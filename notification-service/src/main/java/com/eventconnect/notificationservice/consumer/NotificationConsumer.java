package com.eventconnect.notificationservice.consumer;

import com.eventconnect.notificationservice.entity.Notification;
import com.eventconnect.notificationservice.entity.NotificationType;
import com.eventconnect.notificationservice.event.BookingCreatedEvent;
import com.eventconnect.notificationservice.event.BookingStatusUpdatedEvent;
import com.eventconnect.notificationservice.repository.NotificationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationConsumer {

    private final NotificationRepository notificationRepository;

    @KafkaListener(topics = "booking-created", groupId = "notification-group")
    public void handleBookingCreated(String message) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            BookingCreatedEvent event = mapper.readValue(message, BookingCreatedEvent.class);

            Notification notification = Notification.builder()
                    .bookingId(event.bookingId())
                    .customerId(event.customerId())
                    .message("Your booking " + event.bookingId() + " has been created successfully")
                    .type(NotificationType.BOOKING_CREATED)
                    .build();

            notificationRepository.save(notification);
        } catch (Exception e) {
            log.error("Failed to deserialize booking event: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "booking-updated", groupId = "notification-group")
    public void handleBookingUpdated(String message) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            BookingStatusUpdatedEvent event = mapper.readValue(message, BookingStatusUpdatedEvent.class);

            Notification notification = Notification.builder()
                    .bookingId(event.bookingId())
                    .customerId(event.customerId())
                    .message("Your booking " + event.bookingId() + " status updated")
                    .type(NotificationType.BOOKING_UPDATED)
                    .build();

            notificationRepository.save(notification);
        } catch (Exception e) {
            log.error("Failed to deserialize booking updated event: {}", e.getMessage());
        }
    }
}
