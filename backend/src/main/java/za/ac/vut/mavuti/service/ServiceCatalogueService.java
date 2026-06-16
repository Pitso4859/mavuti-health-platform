package za.ac.vut.mavuti.service;

import za.ac.vut.mavuti.dto.ContactDtos.ServiceResponse;

import java.util.List;

/**
 * Exposes the clinic's service catalogue.
 *
 * <p>A dedicated interface (rather than just a static list returned
 * directly from the controller) so that if the catalogue moves from the
 * {@link za.ac.vut.mavuti.enums.ServiceType} enum to a database table in
 * future, only the implementation changes - the controller and frontend
 * contract remain identical.</p>
 */
public interface ServiceCatalogueService {

    /**
     * Returns all services. Annotated {@code @Cacheable} in the
     * implementation - this endpoint is hit by every visit to the
     * Services page and the appointment booking dropdown, but the data
     * is static, so repeated identical reads should never touch
     * application logic twice within the cache TTL.
     */
    List<ServiceResponse> findAll();
}
