package com.eventconnect.notificationservice.service;

import com.eventconnect.notificationservice.dto.NotificationResponse;
import com.eventconnect.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<NotificationResponse> findByCustomerId(UUID customerId) {
        return notificationRepository.findByCustomerIdOrderBySentAtDesc(customerId).stream()
                .map(NotificationResponse::from)
                .toList();
    }
}
