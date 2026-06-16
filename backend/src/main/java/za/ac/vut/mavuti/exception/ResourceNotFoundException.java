package za.ac.vut.mavuti.exception;

/** Thrown when a requested entity (e.g. appointment) does not exist or does not belong to the caller. */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
