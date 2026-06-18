package com.eventconnect.eventservice.service;

import com.eventconnect.eventservice.dto.EventRequest;
import com.eventconnect.eventservice.dto.EventResponse;
import com.eventconnect.eventservice.dto.EventStatusUpdateRequest;
import com.eventconnect.eventservice.entity.Event;
import com.eventconnect.eventservice.entity.EventStatus;
import com.eventconnect.eventservice.exception.ResourceNotFoundException;
import com.eventconnect.eventservice.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public EventResponse create(EventRequest request) {
        Event event = Event.builder()
                .customerId(request.customerId())
                .title(request.title())
                .description(request.description())
                .eventDate(request.eventDate())
                .guestCount(request.guestCount())
                .city(request.city())
                .status(EventStatus.DRAFT)
                .build();

        return EventResponse.from(eventRepository.save(event));
    }

    public List<EventResponse> findAll(UUID customerId) {
        List<Event> events = customerId != null
                ? eventRepository.findByCustomerId(customerId)
                : eventRepository.findAll();

        return events.stream().map(EventResponse::from).toList();
    }

    public EventResponse getById(UUID id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return EventResponse.from(event);
    }

    public EventResponse updateStatus(UUID id, EventStatusUpdateRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        event.setStatus(request.status());
        return EventResponse.from(eventRepository.save(event));
    }
}
