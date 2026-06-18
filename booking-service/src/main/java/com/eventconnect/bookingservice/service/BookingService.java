package com.eventconnect.bookingservice.service;

import com.eventconnect.bookingservice.dto.BookingRequest;
import com.eventconnect.bookingservice.dto.BookingResponse;
import com.eventconnect.bookingservice.dto.BookingStatusUpdateRequest;
import com.eventconnect.bookingservice.entity.Booking;
import com.eventconnect.bookingservice.entity.BookingStatus;
import com.eventconnect.bookingservice.event.BookingCreatedEvent;
import com.eventconnect.bookingservice.event.BookingStatusUpdatedEvent;
import com.eventconnect.bookingservice.exception.ResourceNotFoundException;
import com.eventconnect.bookingservice.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private static final String BOOKING_CREATED_TOPIC = "booking-created";
    private static final String BOOKING_UPDATED_TOPIC = "booking-updated";

    private final BookingRepository bookingRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public BookingResponse create(BookingRequest request) {
        Booking booking = Booking.builder()
                .eventId(request.eventId())
                .vendorId(request.vendorId())
                .customerId(request.customerId())
                .status(BookingStatus.PENDING)
                .totalAmount(request.totalAmount())
                .build();

        Booking saved = bookingRepository.save(booking);

        BookingCreatedEvent event = new BookingCreatedEvent(
                saved.getId(),
                saved.getEventId(),
                saved.getVendorId(),
                saved.getCustomerId(),
                saved.getTotalAmount(),
                Instant.now()
        );
        kafkaTemplate.send(BOOKING_CREATED_TOPIC, saved.getId().toString(), event);

        return BookingResponse.from(saved);
    }

    public List<BookingResponse> findAll(UUID customerId, UUID vendorId) {
        List<Booking> bookings;
        if (customerId != null && vendorId != null) {
            bookings = bookingRepository.findByCustomerIdAndVendorId(customerId, vendorId);
        } else if (customerId != null) {
            bookings = bookingRepository.findByCustomerId(customerId);
        } else if (vendorId != null) {
            bookings = bookingRepository.findByVendorId(vendorId);
        } else {
            bookings = bookingRepository.findAll();
        }

        return bookings.stream().map(BookingResponse::from).toList();
    }

    public BookingResponse getById(UUID id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        return BookingResponse.from(booking);
    }

    public BookingResponse updateStatus(UUID id, BookingStatusUpdateRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        booking.setStatus(request.status());
        Booking saved = bookingRepository.save(booking);

        BookingStatusUpdatedEvent event = new BookingStatusUpdatedEvent(
                saved.getId(),
                saved.getCustomerId(),
                saved.getStatus(),
                Instant.now()
        );
        kafkaTemplate.send(BOOKING_UPDATED_TOPIC, saved.getId().toString(), event);

        return BookingResponse.from(saved);
    }
}
