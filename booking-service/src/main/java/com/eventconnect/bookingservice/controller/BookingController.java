package com.eventconnect.bookingservice.controller;

import com.eventconnect.bookingservice.dto.BookingRequest;
import com.eventconnect.bookingservice.dto.BookingResponse;
import com.eventconnect.bookingservice.dto.BookingStatusUpdateRequest;
import com.eventconnect.bookingservice.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponse create(@Valid @RequestBody BookingRequest request) {
        return bookingService.create(request);
    }

    @GetMapping
    public List<BookingResponse> findAll(
            @RequestParam(required = false) UUID customerId,
            @RequestParam(required = false) UUID vendorId) {
        return bookingService.findAll(customerId, vendorId);
    }

    @GetMapping("/{id}")
    public BookingResponse getById(@PathVariable UUID id) {
        return bookingService.getById(id);
    }

    @PutMapping("/{id}/status")
    public BookingResponse updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody BookingStatusUpdateRequest request) {
        return bookingService.updateStatus(id, request);
    }
}
