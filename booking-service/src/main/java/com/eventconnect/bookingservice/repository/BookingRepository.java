package com.eventconnect.bookingservice.repository;

import com.eventconnect.bookingservice.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {

    List<Booking> findByCustomerId(UUID customerId);

    List<Booking> findByVendorId(UUID vendorId);

    List<Booking> findByCustomerIdAndVendorId(UUID customerId, UUID vendorId);
}
