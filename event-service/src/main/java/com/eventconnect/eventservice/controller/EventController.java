package com.eventconnect.eventservice.controller;

import com.eventconnect.eventservice.dto.EventRequest;
import com.eventconnect.eventservice.dto.EventResponse;
import com.eventconnect.eventservice.dto.EventStatusUpdateRequest;
import com.eventconnect.eventservice.service.EventService;
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
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EventResponse create(@Valid @RequestBody EventRequest request) {
        return eventService.create(request);
    }

    @GetMapping
    public List<EventResponse> findAll(@RequestParam(required = false) UUID customerId) {
        return eventService.findAll(customerId);
    }

    @GetMapping("/{id}")
    public EventResponse getById(@PathVariable UUID id) {
        return eventService.getById(id);
    }

    @PutMapping("/{id}/status")
    public EventResponse updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody EventStatusUpdateRequest request) {
        return eventService.updateStatus(id, request);
    }
}
