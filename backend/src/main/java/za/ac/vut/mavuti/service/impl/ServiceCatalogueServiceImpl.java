package za.ac.vut.mavuti.service.impl;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import za.ac.vut.mavuti.dto.ContactDtos.ServiceResponse;
import za.ac.vut.mavuti.enums.ServiceType;
import za.ac.vut.mavuti.service.ServiceCatalogueService;

import java.util.Arrays;
import java.util.List;

@Service
public class ServiceCatalogueServiceImpl implements ServiceCatalogueService {

    /**
     * Cached under the "services" cache region, configured with a Redis
     * backend in {@code application.yml} for production profiles. At
     * 50,000 concurrent users, this single cached list can be served
     * directly from Redis (or even the local Caffeine layer in dev)
     * without ever touching this method body again until the TTL expires
     * - the underlying data is an enum, it cannot change without a
     * redeploy anyway.
     */
    @Override
    @Cacheable("services")
    public List<ServiceResponse> findAll() {
        return Arrays.stream(ServiceType.values())
                .map(s -> new ServiceResponse(s, s.getDisplayName(), s.getDescription()))
                .toList();
    }
}
