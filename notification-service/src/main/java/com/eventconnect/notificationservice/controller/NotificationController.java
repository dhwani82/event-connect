package com.eventconnect.notificationservice.controller;

import com.eventconnect.notificationservice.dto.NotificationResponse;
import com.eventconnect.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<NotificationResponse> findByCustomerId(@RequestParam UUID customerId) {
        return notificationService.findByCustomerId(customerId);
    }
}
