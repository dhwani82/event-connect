package com.eventconnect.notificationservice.repository;

import com.eventconnect.notificationservice.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    List<Notification> findByCustomerIdOrderBySentAtDesc(UUID customerId);
}
