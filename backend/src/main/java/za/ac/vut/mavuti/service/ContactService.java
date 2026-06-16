package za.ac.vut.mavuti.service;

import za.ac.vut.mavuti.dto.ContactDtos.ContactMessageRequest;

/** Handles submissions from the public "Contact Us" form. */
public interface ContactService {

    void submit(ContactMessageRequest request);
}
