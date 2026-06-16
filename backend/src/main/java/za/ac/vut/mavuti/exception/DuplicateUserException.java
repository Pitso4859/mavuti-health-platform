package za.ac.vut.mavuti.exception;

/** Thrown when registration is attempted with an institution number or email already in use. */
public class DuplicateUserException extends RuntimeException {
    public DuplicateUserException(String message) {
        super(message);
    }
}
