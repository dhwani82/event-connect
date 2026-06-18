package com.eventconnect.vendorservice.service;

import com.eventconnect.vendorservice.dto.VendorRequest;
import com.eventconnect.vendorservice.dto.VendorResponse;
import com.eventconnect.vendorservice.entity.Category;
import com.eventconnect.vendorservice.entity.Vendor;
import com.eventconnect.vendorservice.exception.ResourceNotFoundException;
import com.eventconnect.vendorservice.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;

    public VendorResponse create(VendorRequest request) {
        Vendor vendor = Vendor.builder()
                .userId(request.userId())
                .businessName(request.businessName())
                .category(request.category())
                .description(request.description())
                .city(request.city())
                .pricePerHour(request.pricePerHour())
                .available(true)
                .build();

        return VendorResponse.from(vendorRepository.save(vendor));
    }

    public List<VendorResponse> findAll(Category category, String city) {
        List<Vendor> vendors;
        if (category != null && city != null) {
            vendors = vendorRepository.findByCategoryAndCity(category, city);
        } else if (category != null) {
            vendors = vendorRepository.findByCategory(category);
        } else if (city != null) {
            vendors = vendorRepository.findByCity(city);
        } else {
            vendors = vendorRepository.findAll();
        }

        return vendors.stream().map(VendorResponse::from).toList();
    }

    public VendorResponse getById(UUID id) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + id));
        return VendorResponse.from(vendor);
    }

    public VendorResponse toggleAvailability(UUID id) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + id));
        vendor.setAvailable(!vendor.isAvailable());
        return VendorResponse.from(vendorRepository.save(vendor));
    }
}
