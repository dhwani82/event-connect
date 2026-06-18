package com.eventconnect.vendorservice.controller;

import com.eventconnect.vendorservice.dto.VendorRequest;
import com.eventconnect.vendorservice.dto.VendorResponse;
import com.eventconnect.vendorservice.entity.Category;
import com.eventconnect.vendorservice.service.VendorService;
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
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VendorResponse create(@Valid @RequestBody VendorRequest request) {
        return vendorService.create(request);
    }

    @GetMapping
    public List<VendorResponse> findAll(
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) String city) {
        return vendorService.findAll(category, city);
    }

    @GetMapping("/{id}")
    public VendorResponse getById(@PathVariable UUID id) {
        return vendorService.getById(id);
    }

    @PutMapping("/{id}/availability")
    public VendorResponse toggleAvailability(@PathVariable UUID id) {
        return vendorService.toggleAvailability(id);
    }
}
