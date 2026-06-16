package za.ac.vut.mavuti.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import za.ac.vut.mavuti.dto.ContactDtos.ServiceResponse;
import za.ac.vut.mavuti.service.ServiceCatalogueService;

import java.util.List;

/**
 * Public endpoint serving the clinic's service catalogue - the API
 * equivalent of the original static {@code services.html} page.
 */
@RestController
@RequestMapping("/api/v1/services")
@RequiredArgsConstructor
public class ServiceCatalogueController {

    private final ServiceCatalogueService serviceCatalogueService;

    @GetMapping
    public ResponseEntity<List<ServiceResponse>> findAll() {
        return ResponseEntity.ok(serviceCatalogueService.findAll());
    }
}
