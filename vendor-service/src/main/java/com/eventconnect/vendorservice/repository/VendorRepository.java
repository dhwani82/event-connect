package com.eventconnect.vendorservice.repository;

import com.eventconnect.vendorservice.entity.Category;
import com.eventconnect.vendorservice.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface VendorRepository extends JpaRepository<Vendor, UUID> {

    List<Vendor> findByCategory(Category category);

    List<Vendor> findByCity(String city);

    List<Vendor> findByCategoryAndCity(Category category, String city);
}
